import re
import random
import json
import os

import boto3

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
    clip_info = json.loads(request.data)
    lambda_client = boto3.client('lambda')
    payload = {
        'user_id': request.user['user_id'],
        'song_file': secure_filename(clip_info['songFile']),
        'start_time': clip_info['startTime'],
        'end_time': clip_info['endTime']
    }
    payload = json.dumps(payload).encode('utf-8')
    response = lambda_client.invoke(
        FunctionName='arn:aws:lambda:us-east-1:149421292640:function:audio_segmentation',
        InvocationType='RequestResponse',
        Payload=payload
    )
    return make_response(jsonify({'success': True}), 200)
