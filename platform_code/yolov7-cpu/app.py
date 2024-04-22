from flask import Flask
from flask_cors import CORS
import warnings

# Filter out UserWarnings raised in the torchvision.models._utils module
warnings.filterwarnings("ignore", category=UserWarning, module="torchvision.models._utils")

JWT_SECRET_KEY = "JWT_KEY"

app = Flask(__name__)
cors_options = {
    "origins": ["http://localhost:3000"],
    "supports_credentials": True
}
CORS(app, **cors_options)

app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY

from thesis_code.features.detection.routes import * # Import routes

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3005, debug=True)
