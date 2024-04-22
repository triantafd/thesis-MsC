from flask import request, g
from functools import wraps
from thesis_code.common.errors import BadRequestError
from thesis_code.features.detection.utils import allowed_file
import json

def validate_image_upload(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if 'image' not in request.files:
            raise BadRequestError('No image part in the request')

        file = request.files['image']
        if not file or not file.filename or not allowed_file(file.filename):
            raise BadRequestError('No selected file or file type not allowed')

        g.uploaded_file = file  # Save the file in Flask's global g object

        return func(*args, **kwargs)

    return decorated_function

def validate_rectangles_data(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        rectangles = request.form.get('rectangles')
        if not rectangles:
            raise BadRequestError('Rectangles data not provided')

        try:
            rectangles_data = json.loads(rectangles)
        except json.JSONDecodeError:
            raise BadRequestError('Invalid JSON format in rectangles data')

        # Store the parsed data in Flask's global g object for access in the decorated function
        g.rectangles_data = rectangles_data

        return func(*args, **kwargs)

    return decorated_function