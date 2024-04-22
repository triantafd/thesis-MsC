from flask import request, g
import jwt
import base64
from functools import wraps
import json
from thesis_code.common.errors import NotAuthorizedError
from app import app

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
        payload = jwt.decode(jwt_token, app.config['JWT_SECRET_KEY'] , algorithms=["HS256"])
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