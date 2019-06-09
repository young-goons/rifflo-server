import re
import random
import json
import os

import flask
from flask import request, jsonify, make_response, send_from_directory
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from ygoons.modules.clip import blueprint, helpers


@blueprint.route('/clip/<post_id>', methods=['GET'])
def get_clip(post_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT clip_path FROM tbl_post WHERE post_id = %s'
        cursor.execute(sql, (post_id, ))
        query_result = cursor.fetchone()
    if query_result is not None:
        url = helpers.s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': app.config['S3_BUCKET_CLIP'],
                'Key': query_result[0]
            },
            ExpiresIn=100)
        return make_response(jsonify({'url': url}), 200)
    else:
        return make_response(jsonify({'msg': 'Post id not found'}), 400)
