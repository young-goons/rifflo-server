import re
import random
import json
import os

import flask
from flask import request, jsonify, make_response, send_from_directory, send_file
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from ygoons.modules.clip import blueprint, helpers


@blueprint.route('/clip/<post_id>', methods=['GET'])
def get_clip(post_id):
    print(post_id)
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT clip_path FROM tbl_post WHERE post_id = %s'
        cursor.execute(sql, (post_id,))
        query_result = cursor.fetchone()
    if query_result is not None:
        file_name = query_result[0].split('/')[-1]
        file_path = '/'.join(query_result[0].split('/')[:-1])
        mp3_file = open(query_result[0], 'rb').read()
        return send_file(query_result[0], mimetype="audio/mp3")
        # response = make_response(mp3_file)
        # response.headers.set('Content-Type', 'audio/mp3')
        # return response
    else:
        return make_response(jsonify({'msg': 'Post id not found'}), 200)
