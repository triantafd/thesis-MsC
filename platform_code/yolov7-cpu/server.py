from flask import Flask, jsonify, request, send_file, g
import os
from my_detect import detect
from my_detect_with_labels import detect_with_labels
from flask_cors import CORS, cross_origin
import jwt
import json
import base64
from functools import wraps

UPLOAD_FOLDER = './mypredictions'
ALLOWED_EXTENSIONS = ['jpg', 'png']
JWT_SECRET_KEY = "JWT_KEY"

app = Flask(__name__)

cors_options = {
    "origins": ["http://localhost:3000"],  # Specify the allowed origin
    "supports_credentials": True           # Enable credentials
}

CORS(app, **cors_options)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = ALLOWED_EXTENSIONS



class CustomError(Exception):
    def __init__(self, message, status_code):
        super().__init__(message)
        self.status_code = status_code

    def serialize_errors(self):
        raise NotImplementedError

class NotAuthorizedError(CustomError):
    def __init__(self):
        super().__init__("Not Authorized", 401)

    def serialize_errors(self):
        return [{"message": "Not authorized"}]

class DatabaseConnectionError(CustomError):
    def __init__(self, reason="Error connecting to database"):
        super().__init__("Error connecting to db", 500)
        self.reason = reason

    def serialize_errors(self):
        return [{"message": self.reason}]

class BadRequestError(CustomError):
    def __init__(self, message):
        super().__init__(message, 400)
        self.message = message 

    def serialize_errors(self):
        return [{"message": self.message}]

class NotFoundError(CustomError):
    def __init__(self):
        super().__init__("Route not found", 404)

    def serialize_errors(self):
        return [{"message": "Not Found"}]

class RequestValidationError(CustomError):
    def __init__(self, errors):
        super().__init__("Invalid request parameters", 400)
        self.errors = errors

    def serialize_errors(self):
        return [{"message": error.msg, "field": error.param} for error in self.errors]


# Global error handler function
@app.errorhandler(Exception)
def handle_error(error):
    if isinstance(error, CustomError):
        # Custom error handling
        response = jsonify({"errors": error.serialize_errors()})
        response.status_code = error.status_code
        return response
    else:
        # Generic error handling for other exceptions
        response = jsonify({"errors": [{"message": "Something went wrong"}]})
        response.status_code = 400
        return response


def get_current_user():
    encoded_token = request.cookies.get('session')
    if not encoded_token:
        return None

    try:
        # Base64 decode the token
        base64_decoded = base64.urlsafe_b64decode(encoded_token + "==").decode("utf-8")
        token_json = json.loads(base64_decoded)
        jwt_token = token_json.get("jwt")

        # Decode the JWT token
        payload = jwt.decode(jwt_token, JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, ValueError, KeyError):
        return None

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_current_user()
        if current_user is None:
            raise NotAuthorizedError()
        g.current_user = current_user # Store the user in Flask's global object
        return f(*args, **kwargs)
    return decorated_function

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def convert_rectangles_to_xyxy(rectangles):
    xyxy_arrays = []

    for rect_obj in rectangles:
        rect = rect_obj['rect']
        x1, y1, x2, y2 = rect['x1'], rect['y1'], rect['x2'], rect['y2']

        # Ensure x1 is always less than x2, and y1 is always less than y2
        x1, x2 = min(x1, x2), max(x1, x2)
        y1, y2 = min(y1, y2), max(y1, y2)

        xyxy = [x1, y1, x2, y2]
        xyxy_arrays.append(xyxy)

    return xyxy_arrays


@app.route('/api/detection/hello', methods=['GET'])
@cross_origin(supports_credentials=True)
def hello():
    return jsonify({'message': 'Hello from Flask!'}), 200

@app.route('/api/detection/image', methods=['POST'])
@cross_origin(supports_credentials=True)
@require_auth
def receive_image():
    if 'image' not in request.files:
         raise BadRequestError('No image part')

    file = request.files['image']
    
    if not file.filename or not allowed_file(file.filename):
        raise BadRequestError('No selected file')

    # Save the file with its original filename
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(name=UPLOAD_FOLDER, exist_ok=True)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    image_detection_path = detect(file_path)

    # Return the file
    #return jsonify({'message': 'Image received successfully'}), 200
    return send_file(image_detection_path, mimetype=file.content_type)  # Adjust mimetype accordingly


@app.route('/api/detection/image-with-labels', methods=['POST'])
@cross_origin(supports_credentials=True)
@require_auth
def receive_image_with_labels():
    try:
        if 'image' not in request.files:
            raise BadRequestError('No image part')
        
        file = request.files['image']
        if not file.filename or not allowed_file(file.filename):
            raise BadRequestError('No selected file')

        rectangles = request.form.get('rectangles')
        if not rectangles:
            raise BadRequestError('Rectangles data not provided')

        try:
            rectangles_data = json.loads(rectangles)
        except json.JSONDecodeError:
            raise BadRequestError('Invalid JSON format in rectangles data')

        xyxy_formatted = convert_rectangles_to_xyxy(rectangles_data)
        
        print(xyxy_formatted)

        # Save the file with its original filename
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(name=UPLOAD_FOLDER, exist_ok=True)

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        image_detection_path = detect_with_labels(file_path, xyxy_formatted)

        # Return the file
        #return jsonify({'message': 'Image received successfully'}), 200
        return send_file(image_detection_path, mimetype=file.content_type)  # Adjust mimetype accordingly
    except Exception as e:
            """ # Log the exception for debugging
            print(f"An error occurred: {e}")

            # Return a generic error message to the user
            return jsonify({'error': 'An unexpected error occurred'}), 500 """
            raise # to go the the global error handler

if __name__ == '__main__':
    app.run(debug=True, port=3005)