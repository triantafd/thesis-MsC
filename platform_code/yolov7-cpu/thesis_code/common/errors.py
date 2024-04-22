from flask import jsonify
from app import app

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