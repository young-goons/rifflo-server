import re
import random
import json
import os

import flask
from flask import request, jsonify, make_response, send_from_directory
from flask import current_app as app
from werkzeug.utils import secure_filename

from ygoons.modules.clip import blueprint, helpers
from ygoons.utils import aws_amplify_login_required

# @blueprint.route('/clip/<post_id>', methods=['GET'])
# def get_clip(post_id):
#     with flask.g.pymysql_db.cursor() as cursor:
#         sql = 'SELECT clip_path FROM tbl_post WHERE post_id = %s'
#         cursor.execute(sql, (post_id, ))
#         query_result = cursor.fetchone()
#     if query_result is not None:
#         url = app.config['S3'].generate_presigned_url(
#             'get_object',
#             Params={
#                 'Bucket': app.config['S3_BUCKET_CLIP'],
#                 'Key': query_result[0]
#             },
#             ExpiresIn=100)
#         return make_response(jsonify({'url': url}), 200)
#     else:
#         return make_response(jsonify({'msg': 'Post id not found'}), 400)


@blueprint.route('/clip', methods=['POST'])
@aws_amplify_login_required
def post_clip():
    user_id = request.user['user_id']
    clip_info = json.loads(request.data)
    print(clip_info)
