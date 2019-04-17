import re
import random

import flask
from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity)
import pymysql

from ygoons import config

app = Flask(__name__)
CORS(app)

# Set up JWT
app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = config.JWT_ACCESS_TOKEN_EXPIRES
jwt = JWTManager(app)

# Connect to database
with app.app_context():
    connection = pymysql.connect(
        host=config.DB_HOST, 
        port=config.DB_PORT, 
        user=config.DB_USER,
        passwd=config.DB_PASSWORD, 
        db=config.DB_NAME
        )
    flask.g.pymysql_db = connection

# Error handlers
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return make_response(jsonify({
        'success': False,
        'message': 'Missing Authorization Header'
    }), 401)

@app.errorhandler(400)
def bad_params(error):
    return make_response(jsonify({'msg': 'Bad parameters'}), 400)

# After initialization, import routes
from ygoons import routes

####################
