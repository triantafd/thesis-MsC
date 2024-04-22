from flask import jsonify, request, send_file, g, send_from_directory
from flask_cors import cross_origin
from app import app
from thesis_code.common.auth import require_auth
from thesis_code.features.detection.utils import  construct_response, convert_rectangles_to_xyxy_with_labels, save_file
from thesis_code.features.detection.services.my_detect import detect
from thesis_code.features.detection.services.my_detect_with_labels import detect_with_labels
from thesis_code.features.detection.decorators import validate_image_upload, validate_rectangles_data
import base64
from thesis_code.features.detection.config import FILE_SERVER_DIR

@app.route('/api/detection/hello', methods=['GET'])
@cross_origin(supports_credentials=True)
def hello():
    return jsonify({'message': 'Hello from Flask!'}), 200

@app.route('/api/detection/image', methods=['POST'])
@cross_origin(supports_credentials=True)
@require_auth
@validate_image_upload #validate and return image g.uploaded_file
def receive_image():
    file = g.uploaded_file # Access the file from g

    file_path = save_file(file) # Save the file with its original filename and return the path

    image_detection_path, metadata = detect(file_path) # detect file

    response_with_metadata = construct_response(request.host_url, image_detection_path, metadata) #construct response with metadata

    return jsonify(response_with_metadata)
    #return send_file(image_detection_path, mimetype=file.content_type)  # Adjust mimetype accordingly


@app.route('/api/detection/image-with-labels', methods=['POST'])
@cross_origin(supports_credentials=True)
@require_auth
@validate_image_upload  #validate and return image g.uploaded_file
@validate_rectangles_data #validate and return rectangles_data g.rectangles_data
def receive_image_with_labels():
    try:
        file = g.uploaded_file # Access the file from g

        rectangles_data = g.rectangles_data # Access the rectangles_data from g.rectangles_data

        to_xyxy_with_labels = convert_rectangles_to_xyxy_with_labels(rectangles_data)

        file_path = save_file(file)  # Save the file with its original filename and return the path

        image_detection_path , metadata = detect_with_labels(file_path, to_xyxy_with_labels) # detect file

        response_with_metadata = construct_response(request.host_url, image_detection_path, metadata) #construct response with metadata

        return jsonify(response_with_metadata)
        #return send_file(image_detection_path, mimetype=file.content_type)  # Adjust mimetype accordingly
    
    except Exception as e:
            raise # to go the the global error handler
    

@app.route('/runs/detect/<filename>', methods=['GET'])  # Typically, file serving should use GET method
def serve_file(filename):
    return send_from_directory(FILE_SERVER_DIR, filename)