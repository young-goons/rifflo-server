import re
import random
import json

import flask
from flask import request, jsonify, abort, make_response
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity)

from ygoons.authentication import hash_password, verify_password

from ygoons import app


# TODO - add token blacklist and use the refreshing functionality
@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    curr_user = get_jwt_identity()
    ret = {
        'access_token': create_access_token(identity={'userId': curr_user['userId'],
                                                      'username': curr_user['username']})
    }
    return make_response(jsonify({ret}), 200)


# TODO - check if the username or something already exists
#      - Error handling
#      - what if tbl_user_info does not get filled
@app.route('/signup', methods=['POST'])
def sign_up():
    email = request.args.get('email')
    username = request.args.get('username')
    password = request.args.get('password')
    with flask.g.pymysql_db.cursor() as cursor:
        sql = "INSERT INTO tbl_user (email, username, password) " \
              "VALUES (%s, %s, %s)"
        cursor.execute(sql, (email, username, hash_password(password)))
        user_id = cursor.lastrowid
        user_info_rowcnt = 0
        if user_id:
            # create a row in tbl_user_info for the newly registered user
            sql = "INSERT INTO tbl_user_info (user_id) " \
                  "VALUES (%s)"
            user_info_rowcnt = cursor.execute(sql, (user_id))

    if user_id and user_info_rowcnt:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "New user not added"}), 400)


# TODO - action when signin is denied i.e. when wrong password e.t.c
@app.route('/signin', methods=['POST'])
def sign_in():
    email = request.args.get('email')
    password = request.args.get('password')
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT user_id, username, password FROM tbl_user ' \
              'WHERE email = %s'
        cursor.execute(sql, (email))
        query_result = cursor.fetchall()

    if len(query_result) != 1:
        return make_response(jsonify({'msg': "Error while fetching user data"}), 400)

    user = {
        'user_id': query_result[0][0],
        'username': query_result[0][1],
    }

    # validate user password
    stored_password = query_result[0][2]
    if verify_password(stored_password, password):
        access_token = create_access_token(identity={'userId': user['user_id'],
                                                     'username': user['username']})
        refresh_token = create_refresh_token(identity={'userId': user['user_id'],
                                                       'username': user['username']})
        user['access_token'] = access_token
        user['refresh_token'] = refresh_token
        return make_response(jsonify({'user': user}), 200)
    else:
        return make_response(jsonify({'user': None}), 200)


@app.route('/signout', methods=['POST'])
def sign_out():
    return make_response(jsonify({'success': True}), 200)


# TODO: distinguish public and private info
@app.route('/user/<int:user_id>/info', methods=['GET'])
@jwt_required
def get_user_info(user_id):
    """
    Fetches and returns user information stored in tbl_user_info
    :param user_id: user_id of request
    """
    # check if the identity of the token is equal to the identity of the request parameter
    if user_id == get_jwt_identity()['userId']:
        with flask.g.pymysql_db.cursor() as cursor:
            sql = 'SELECT user_id, username, email, following_count, follower_count, ' \
                  'profile_picture_path FROM tbl_user NATURAL JOIN' \
                  '(SELECT * FROM tbl_user_info WHERE user_id = %s) tbl_user_info_id'
            cursor.execute(sql, (user_id))
            query_result = cursor.fetchall()

        if len(query_result) != 1:
            return make_response(jsonify({'msg': 'Error fetching user info data'}), 400)

        user = {
            'user_id': query_result[0][0],
            'username': query_result[0][1],
            'email': query_result[0][2],
            'following_count': query_result[0][3],
            'follower_count': query_result[0][4],
            'profile_picture_path': query_result[0][5]
        }
        return make_response(jsonify({'user': user}), 200)
    else:
        return make_response(jsonify({'msg': 'No authentication on requested data'}), 400)


@app.route('/user/id/username/<string:username>', methods=['GET'])
def get_user_exists_by_username(username):
    """
    Fetches existence of user of the input username and returns user_id if exists
    :param username: username to check existence of
    """

    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT user_id FROM tbl_user WHERE username = %s'
        cursor.execute(sql, username)
        query_result = cursor.fetchone()
    if query_result is not None:
        return make_response(jsonify({'userId': query_result[0]}), 200)
    else:
        return make_response(jsonify({'userId': None}), 200)


@app.route('/user/id/email/<string:email>', methods=['GET'])
def get_user_exists_by_email(email):
    """
    Fetches existence of user of the input email and returns username if exists
    :param email: email to check existence of
    """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT user_id FROM tbl_user WHERE email = %s'
        cursor.execute(sql, email)
        query_result = cursor.fetchone()
    if query_result is not None:
        return make_response(jsonify({'userId': query_result[0]}), 200)
    else:
        return make_response(jsonify({'userId': None}), 200)


@app.route('/user/<int:user_id>/posts', methods=['GET'])
@jwt_required
def get_user_posts(user_id):
    """ Obtains the list of ids of the posts that the user has posted """
    shuffle = request.args.get('shuffle')
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT post_id FROM tbl_post NATURAL JOIN ' \
              '(SELECT user_id, username FROM tbl_user WHERE user_id = %s) tbl_user_id'
        cursor.execute(sql, (user_id))
        query_result = cursor.fetchall()
    post_id_list = []
    for row in query_result:
        post_id_list.append(row[0])
    if shuffle:
        random.shuffle(post_id_list)
    return make_response(jsonify({'postIdArr': post_id_list}), 200)


@app.route('/user/feed', methods=['GET'])
@jwt_required
def get_user_feed():
    """ Obtains the list of post_ids to appear on the user feed
        and sends the list of ids to the client """
    user_id = get_jwt_identity()['userId']
    print('Feed user_id: ', user_id)
    # obtain the list of ids of all the posts shared by other users for now...
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT post_id FROM tbl_post WHERE user_id != %s'
        cursor.execute(sql, (user_id))
        query_result = cursor.fetchall()
    post_id_list = []
    for row in query_result:
        post_id_list.append(row[0])
    random.shuffle(post_id_list)
    print("Feed post ids: ", post_id_list)
    return make_response(jsonify({'postIdArr': post_id_list}), 200)


# TODO - error handling
#      - add option to include or exclude music clips
#      - empty id_list - return null
@app.route('/posts/<id_list>', methods=['GET'])
def get_posts(id_list):
    """
    Returns a dictionary {post_id: post_info} where post_info is fetched from db
    id_list must not be an empty string
    :param id_list: list of integer ids separated by ,
    """
    if not re.match(r'^\d+(?:,\d+)*,?$', id_list):
        abort(400)
    post_ids = [int(i) for i in id_list.split(',')]
    with flask.g.pymysql_db.cursor() as cursor:
        # TODO - there must be a better way of putting multiple ids in IN () clause
        sql = 'SELECT post_id, user_id, username, upload_date, content, tags, ' \
              'song_id, clip_path, song_name, artist ' \
              'FROM (SELECT * FROM tbl_post WHERE post_id  IN ({})) tbl_post_id ' \
              'NATURAL JOIN (SELECT user_id, username FROM tbl_user) tbl_user_id ' \
              'NATURAL JOIN tbl_song_info'.format(id_list)
        cursor.execute(sql)
        query_result = cursor.fetchall()
    post_dict = {}
    for row in query_result:
        post_data = {
            'userId': row[1],
            'username': row[2],
            'uploadDate': row[3],
            'content': row[4],
            'tags': row[5],
            'songId': row[6],
            'clipPath': row[7],
            'songName': row[8],
            'artist': row[9]
        }
        post_dict[row[0]] = post_data

    return make_response(jsonify({'posts': post_dict}), 200)


@app.route('/user/upload/song', methods=['POST'])
@jwt_required
def upload_song():
    pass


@app.route('/user/upload/post', methods=['POST'])
@jwt_required
def upload_post():
    """
    Uploads the post whose content is received from user who is identified through jwt token
    """
    user = get_jwt_identity()
    user_id = user['userId']
    data = json.loads(request.data)
    content = data['content']
    tags = data['tags']
    
    # temporary data for now
    clip_path = ''
    song_name = "abc"
    artist = "def"

    with flask.g.pymysql_db.cursor() as cursor:
        sql = "INSERT INTO tbl_song_info (song_name, artist)" \
              "VALUES (%s, %s)"
        cursor.execute(sql, (song_name, artist))
        song_id = cursor.lastrowid
        post_id = None
        if song_id:
            sql = "INSERT INTO tbl_post (user_id, content, tags, song_id, clip_path)" \
                  "VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (user_id, content, tags, song_id, clip_path))
            post_id = cursor.lastrowid

    if song_id and post_id:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'postId': post_id, 'songId': song_id}), 200)
    else:
        return make_response(jsonify({'msg': 'Error uploading post and song'}), 400)
