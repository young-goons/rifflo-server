import re
import random

import flask
from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required,
                                get_jwt_identity)
import pymysql

try:
    from ygoons import config
except ImportError:
    from ygoons import default_config as config

from ygoons import constants
from ygoons.modules import user, post, clip, auth, comment

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Cross-Origin Resource Sharing

# Load blueprint modules
app.register_blueprint(user.blueprint)
app.register_blueprint(post.blueprint)
app.register_blueprint(clip.blueprint)
app.register_blueprint(auth.blueprint)
app.register_blueprint(comment.blueprint)

# Set up JWT
app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = config.JWT_ACCESS_TOKEN_EXPIRES
app.config['SONG_STORAGE_PATH'] = config.SONG_STORAGE_PATH
app.config['CLIP_STORAGE_PATH'] = config.CLIP_STORAGE_PATH
app.config['IMAGE_STORAGE_PATH'] = config.IMAGE_STORAGE_PATH
app.config['S3_BUCKET'] = config.S3_BUCKET
app.config['S3_SECRET'] = config.S3_SECRET
app.config['S3_KEY'] = config.S3_KEY
jwt = JWTManager(app)


# Connect to database
@app.before_request
def before_request():
    connection = pymysql.connect(host=config.DB_HOST,
                                 port=config.DB_PORT,
                                 user=config.DB_USER,
                                 passwd=config.DB_PASSWORD,
                                 db=config.DB_NAME)
    flask.g.pymysql_db = connection


# Disconnect from database
@app.teardown_request
def teardown_request(exception):
    db = flask.g.pop('pymysql_db', None)
    if db: db.close()


# Error handlers
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return make_response(
        jsonify({
            'success': False,
            'message': 'Missing Authorization Header'
        }), 401)


@app.errorhandler(400)
def bad_params(error):
    return make_response(jsonify({'msg': 'Bad parameters'}), 400)


# After initialization, import routes
from ygoons import routes

####################
