import re
import random
import json
import os

import flask
from flask import request, jsonify, make_response
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from pydub import AudioSegment

from ygoons.modules.post import blueprint, helpers


# TODO - error handling
#      - add option to include or exclude music clips
#      - empty id_list - return null
#      - posts vs post?
@blueprint.route('/post/', defaults={'id_list': None})
@blueprint.route('/post/<id_list>', methods=['GET'])
def get_posts(id_list):
    """
    Returns a dictionary {post_id: post_info} where post_info is fetched from db
    id_list must not be an empty string
    :param id_list: list of integer ids separated by ,
    """
    if id_list is None:
        return make_response(jsonify({'posts': None}), 200)
    if not re.match(r'^\d+(?:,\d+)*,?$', id_list):
        return make_response(jsonify({'msg': "id_list is in wrong format"}),
                             400)
    with flask.g.pymysql_db.cursor() as cursor:
        # TODO - there must be a better way of putting multiple ids in IN () clause
        # obtain information about the post
        sql = 'SELECT post_id, user_id, username, upload_date, content, tags, ' \
              '  song_id, clip_path, song_name, artist ' \
              'FROM (SELECT * FROM tbl_post WHERE post_id IN ({})) tbl_post_id ' \
              'NATURAL JOIN (SELECT user_id, username FROM tbl_user) tbl_user_id ' \
              'NATURAL JOIN tbl_song_info'.format(id_list)
        cursor.execute(sql)
        query_result = cursor.fetchall()
    post_dict = {}
    for row in query_result:
        post_data = {
            'postId': row[0],
            'userId': row[1],
            'username': row[2],
            'uploadDate': row[3],
            'content': row[4],
            'tags': row[5],
            'songId': row[6],
            'clipPath': row[7],
            'songName': row[8],
            'artist': row[9],
        }
        post_dict[row[0]] = post_data
    print(post_dict)
    return make_response(jsonify({'posts': post_dict}), 200)


@blueprint.route('/post', methods=['POST'])
@jwt_required
def upload_post():
    """
    Uploads the post whose content is received from user who is identified through jwt token
    """
    user = get_jwt_identity()
    user_id = user['userId']
    file = request.files['songFile']
    print(request.form)

    # file is saved in SONG_STORAGE_PATH/userid/.mp3
    if not os.path.isdir(
            os.path.join(app.config["SONG_STORAGE_PATH"], str(user_id))):
        os.makedirs(os.path.join(app.config["SONG_STORAGE_PATH"],
                                 str(user_id)),
                    exist_ok=True)
    song_file_path = os.path.join(app.config["SONG_STORAGE_PATH"],
                                  str(user_id), secure_filename(file.filename))
    # TODO: instead of checking if the filename is the same, not insert into table if
    #       the song_name already exists
    if not os.path.exists(song_file_path):
        file.save(song_file_path)

    # cut the audio file and save it to the storage
    if file.filename[-4:] == ".mp3":
        file_format = 'mp3'
    elif file.filename[-4:] == ".wav":
        file_format = 'wav'

    # TODO: directly used the file passed on instead of reading it from the local? (maybe not necessary)
    full_song = AudioSegment.from_file(song_file_path, format=file_format)
    clip = full_song[int(float(request.form['clipStart']) *
                         1000):int(float(request.form['clipEnd']) * 1000)]
    clip_name = file.filename[:-4] + "_" + request.form[
        'clipStart'] + "_" + request.form['clipEnd'] + file.filename[-4:]
    if not os.path.isdir(
            os.path.join(app.config["CLIP_STORAGE_PATH"], str(user_id))):
        os.makedirs(os.path.join(app.config["CLIP_STORAGE_PATH"],
                                 str(user_id)),
                    exist_ok=True)
    clip_file_path = os.path.join(app.config["CLIP_STORAGE_PATH"],
                                  str(user_id), secure_filename(clip_name))

    if not os.path.exists(clip_file_path):
        clip.export(clip_file_path, format=file_format)

    if request.form['date']:
        release_date = request.form['date']
    else:
        release_date = None

    with flask.g.pymysql_db.cursor() as cursor:
        sql = "INSERT INTO tbl_song_info (song_name, artist, release_date, album, song_path) " \
              "VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql,
                       (request.form['track'], request.form['artist'],
                        release_date, request.form['album'], song_file_path))
        song_id = cursor.lastrowid
        post_id = None
        if song_id:
            sql = "INSERT INTO tbl_post (user_id, content, tags, song_id, clip_start_time, clip_end_time, clip_path) " \
                  "VALUES (%s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(
                sql, (user_id, request.form['content'], request.form['tags'],
                      song_id, request.form['clipStart'],
                      request.form['clipEnd'], clip_file_path))
            post_id = cursor.lastrowid

    if song_id and post_id:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({
            'postId': post_id,
            'songId': song_id
        }), 200)
    else:
        return make_response(jsonify({'msg': 'Error uploading post and song'}),
                             400)


@blueprint.route('/post/<int:post_id>/like', methods=['POST'])
@jwt_required
def like_post(post_id):
    curr_user = get_jwt_identity()
    curr_user_id = curr_user['userId']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'INSERT INTO tbl_like (post_id, user_id) ' \
              'VALUES (%s, %s)'
        affected_row_cnt = cursor.execute(sql, (post_id, curr_user_id))
    if affected_row_cnt == 1:  # if exactly one row is affected
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "Like failed"}), 400)


@blueprint.route('/post/<int:post_id>/like', methods=['DELETE'])
@jwt_required
def unlike_post(post_id):
    curr_user = get_jwt_identity()
    curr_user_id = curr_user['userId']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'DELETE FROM tbl_like WHERE post_id = %s AND user_id = %s'
        affected_row_cnt = cursor.execute(sql, (post_id, curr_user_id))
    if affected_row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'success': False}), 400)


@blueprint.route('/post/<int:post_id>/dislike', methods=['POST'])
@jwt_required
def dislike_post(post_id):
    curr_user = get_jwt_identity()
    curr_user_id = curr_user['userId']
    affected_row_cnt = helpers.upload_post_dislike(post_id, curr_user_id)
    if affected_row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "Dislike failed"}), 400)


@blueprint.route('/post/<int:post_id>/like', methods=['GET'])
@jwt_required
def get_post_likes(post_id):
    """
    Obtains list of user_id's that liked the post
    :param post_id:
    """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT user_id FROM tbl_like WHERE post_id = %s'
        cursor.execute(sql, (post_id, ))
        query_result = cursor.fetchall()
    like_user_list = []
    for row in query_result:
        like_user_list.append(row[0])
    return make_response(jsonify({'users': like_user_list}))


@blueprint.route('/post/<int:post_id>/bookmark', methods=['POST'])
@jwt_required
def bookmark_post(post_id):
    pass


@blueprint.route('/post/<int:post_id>/bookmark', methods=['DELETE'])
@jwt_required
def remove_bookmark(post_id):
    pass


@blueprint.route('/post/<int:post_id>/comment', methods=['POST'])
@jwt_required
def post_comment(post_id):
    """
    Upload comment passed in as the body of POST request
    :param post_id:
    """
    curr_user = get_jwt_identity()
    curr_user_id = curr_user['userId']
    data = json.loads(request.data)
    content = data['content']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'INSERT INTO tbl_comment (post_id, user_id, content)' \
              'VALUES (%s, %s, %s)'
        affected_row_cnt = cursor.execute(sql,
                                          (post_id, curr_user_id, content))
        comment_id = cursor.lastrowid
    if affected_row_cnt == 1 and comment_id:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'commentId': comment_id}), 200)
    else:
        return make_response(jsonify({'msg': 'Failed uplaoding comment'}), 400)


@blueprint.route('/post/<int:post_id>/comment', methods=['GET'])
def get_post_comments(post_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT comment_id, user_id, username, comment_date, content ' \
              'FROM (SELECT * FROM tbl_comment WHERE post_id = %s) tbl_post_comment ' \
              'NATURAL JOIN tbl_user ' \
              'ORDER BY comment_date DESC'
        cursor.execute(sql, (post_id, ))
        query_result = cursor.fetchall()
    # choose the two most recent comments for preview
    comment_preview_list = []
    for idx, row in enumerate(query_result):
        comment = {
            'commentId': row[0],
            'userId': row[1],
            'username': row[2],
            'commentDate': row[3],
            'commentContent': row[4]
        }
        if request.args['preview'] == 'true' and idx >= 2:
            break
        comment_preview_list.append(comment)
    comment_preview_list.reverse()
    return make_response(
        jsonify({
            'commentPreviewArr': comment_preview_list,
            'commentCnt': len(query_result)
        }), 200)
