from thesis_code.features.detection.config import ALLOWED_CLASSIFICATION_CATEGORIES, UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from thesis_code.common.errors import BadRequestError
import os

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_rectangles_to_xyxy_with_labels(rectangles):
    bboxes_with_categories = {}
    converted_data = []
    categories = []

    for rect_obj in rectangles:
        rect = rect_obj['rect']
        category = rect_obj['label']
        x1, y1, x2, y2 = rect['x1'], rect['y1'], rect['x2'], rect['y2']

        # Ensure x1 is always less than x2, and y1 is always less than y2
        x1, x2 = min(x1, x2), max(x1, x2)
        y1, y2 = min(y1, y2), max(y1, y2)

        xyxy = [x1, y1, x2, y2]
        converted_data.append(xyxy)

        validate_labels(category)
        categories.append(category)
    
    bboxes_with_categories['bboxes'] = converted_data
    bboxes_with_categories['categories'] = categories

    return bboxes_with_categories


def validate_labels(category):
    if category not in ALLOWED_CLASSIFICATION_CATEGORIES:
        raise BadRequestError(f"Category '{category}' is not allowed. Allowed categories are: {ALLOWED_CLASSIFICATION_CATEGORIES}")
    
def save_file(file):
    """
    Saves the file to the specified upload folder and returns the file path.

    :param file: The file object received from the client.
    :return: The path to the saved file.
    """
    # Ensure the upload folder exists
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # Construct the full file path
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # Save the file
    file.save(file_path)

    # Return the file path
    return file_path

def construct_response(host_url, image_detection_path, labels):
    """
    Constructs a response with a file URL and metadata.

    Args:
    host_url (str): The base URL from the request.
    image_detection_path (str): The path to the image detection file.
    labels (dict): The metadata labels.

    Returns:
    dict: A dictionary containing the file URL and metadata.
    """
    # Construct file URL
    file_url = host_url + image_detection_path

    # Construct the response
    response = {
        'url': file_url,
        'metadata': labels
    }

    return response
