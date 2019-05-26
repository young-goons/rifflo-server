import re
import json
import os

import flask
from flask import request, jsonify, make_response
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from pydub import AudioSegment

from ygoons.modules.comment import blueprint, helpers


@blueprint.route('/comment/<int:comment_id>/reply', methods=['GET'])
@jwt_required
def get_reply(comment_id):
    query_result = helpers.get_reply_data(comment_id)

    reply_list = []
    for idx, row in enumerate(query_result):
        reply = {
            'replyId': row[0],
            'userId': row[1],
            'username': row[2],
            'content': row[3],
            'replyDate': row[4]
        }
        reply_list.append(reply)

    return make_response(jsonify({'replyArr': reply_list}), 200)


@blueprint.route('/comment/<int:comment_id>/reply', methods=['POST'])
@jwt_required
def upload_reply(comment_id):
    """
    Upload reply passed in as the body of POST request
    """
    curr_user = get_jwt_identity()
    curr_user_id = curr_user['userId']
    data = json.loads(request.data)
    content = data['content']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        INSERT INTO tbl_reply (comment_id, user_id, content)
        VALUES (%s, %s, %s)
        '''
        affected_row_cnt = cursor.execute(sql,
                                          (comment_id, curr_user_id, content))
        reply_id = cursor.lastrowid
    if affected_row_cnt == 1 and reply_id:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'replyId': reply_id}), 200)
    else:
        return make_response(jsonify({'msg': 'Failed upldaing reply'}), 400)
