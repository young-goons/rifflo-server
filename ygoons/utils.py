from functools import wraps
from urllib import request as web_request

from flask import Flask, jsonify, request
from jose import jwt

from . import config

BANNED_USERNAME_SET = {"help", "people", "contact", "post"}

BANNED_CHAR_SET = {"\\", "/", ":", "*", "?", "\"", "<", ">", "|", " "}


def validate_username(username):
    """ Validate input usernmae """
    if username in BANNED_USERNAME_SET:
        return False
    else:
        username_valid = True
        for char in username:
            if char in BANNED_CHAR_SET:
                username_valid = False
                break
        return username_valid


def decode_token(jwt_token):
    jwks = web_request.urlopen('https://cognito-idp.us-east-1.amazonaws.com/{}/.well-known/jwks.json'.format(config.COGNITO_USER_POOL_ID))
    issuer = 'https://cognito-idp.us-east-1.amazonaws.com/{}'.format(config.COGNITO_USER_POOL_ID)
    audience = config.COGNITO_CLIENT_ID

    payload = jwt.decode(
        jwt_token,
        jwks.read(),
        algorithms=['RS256'],
        audience=audience,
        issuer=issuer,
        options={'verify_at_hash': False}
    )

    return payload


def get_identity(jwt_token):
    payload = decode_token(jwt_token)
    print(payload)
    user = {
        'email': payload['email'],
        'user_id': payload['cognito:username'],
    }
    return user


def aws_amplify_login_required(view):
    @wraps(view)
    def wrap(*args, **kwargs):
        token = request.headers.get('Authorization')
        auth_error = (jsonify({'msg': 'User not authenticated'}), 403)
        if not token:
            return auth_error

        user = get_identity(token)
        if user:
            request.user = user
            return view(*args, **kwargs)
        else:
            return auth_error
    return wrap

# Reference

# https://medium.com/@eu.galioto/the-simplest-server-configuration-for-your-aws-amplify-cognito-app-a074c01c743d