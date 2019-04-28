import re
import random
import json

import flask
from flask import request, jsonify, abort, make_response
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required,
                                get_jwt_identity)

from ygoons.authentication import hash_password, verify_password

from ygoons import app


# TODO - add token blacklist and use the refreshing functionality
@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    curr_user = get_jwt_identity()
    ret = {
        'access_token':
        create_access_token(identity={
            'userId': curr_user['userId'],
            'username': curr_user['username']
        })
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
        cursor.execute(sql, (email, ))
        query_result = cursor.fetchall()

    if len(query_result) != 1:
        return make_response(
            jsonify({'msg': "Error while fetching user data"}), 400)

    user = {
        'user_id': query_result[0][0],
        'username': query_result[0][1],
    }

    # validate user password
    stored_password = query_result[0][2]
    if verify_password(stored_password, password):
        access_token = create_access_token(identity={
            'userId': user['user_id'],
            'username': user['username']
        })
        refresh_token = create_refresh_token(identity={
            'userId': user['user_id'],
            'username': user['username']
        })
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
            sql = 'SELECT user_id, username, email, profile_picture_path ' \
                  'FROM tbl_user NATURAL JOIN' \
                  '(SELECT * FROM tbl_user_info WHERE user_id = %s) tbl_user_info_id'
            cursor.execute(sql, (user_id, ))
            query_result = cursor.fetchall()

        if len(query_result) != 1:
            return make_response(
                jsonify({'msg': 'Error fetching user info data'}), 400)

        user = {
            'userId': query_result[0][0],
            'username': query_result[0][1],
            'email': query_result[0][2],
            'profile_picture_path': query_result[0][3]
        }
        return make_response(jsonify({'user': user}), 200)
    else:
        return make_response(
            jsonify({'msg': 'No authentication on requested data'}), 400)


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
    # obtain the list of ids of all the posts shared by other users for now...
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT post_id FROM tbl_post WHERE user_id != %s'
        cursor.execute(sql, (user_id))
        query_result = cursor.fetchall()
    post_id_list = []
    for row in query_result:
        post_id_list.append(row[0])
    random.shuffle(post_id_list)
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
        sql = "INSERT INTO tbl_song_info (song_name, artist) " \
              "VALUES (%s, %s)"
        cursor.execute(sql, (song_name, artist))
        song_id = cursor.lastrowid
        post_id = None
        if song_id:
            sql = "INSERT INTO tbl_post (user_id, content, tags, song_id, clip_path) " \
                  "VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (user_id, content, tags, song_id, clip_path))
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


# TODO: error-handling for insert? make sure insert is actually executed
#       disable following yourself
@app.route('/user/follow/<int:followed_user_id>', methods=['POST'])
@jwt_required
def user_follow(followed_user_id):
    """
    Follow the user of given user_id
    :param followed_user_id: user_id of the user to follow
    """
    curr_user = get_jwt_identity()
    curr_user_id = curr_user['userId']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'INSERT INTO tbl_follow (followed_id, follower_id) ' \
              'VALUES (%s, %s)'
        affected_row_cnt = cursor.execute(sql,
                                          (followed_user_id, curr_user_id))
    if affected_row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "User follow failed"}), 400)


# TODO: disabel unfollowing yourself
@app.route('/user/follow/<int:followed_user_id>', methods=['DELETE'])
@jwt_required
def user_unfollow(followed_user_id):
    """
    Unfollow the user of given user_id
    :param followed_user_id: user_id of the user to unfollow
    :return:
    """
    curr_user = get_jwt_identity()
    curr_user_id = curr_user['userId']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'DELETE FROM tbl_follow WHERE followed_id = %s AND follower_id = %s'
        affected_row_cnt = cursor.execute(sql,
                                          (followed_user_id, curr_user_id))
    if affected_row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "User unfollow failed"}), 400)


@app.route('/user/<int:user_id>/following', methods=['GET'])
def get_following(user_id):
    """
    Obtain the list of ids of the users that the user of user_id is following
    :param user_id:
    """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT followed_id, username FROM ' \
              '(SELECT followed_id FROM tbl_follow WHERE follower_id = %s) tbl_user_follow ' \
              'INNER JOIN tbl_user ON followed_id = user_id'
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()
    following_list = []
    for row in query_result:
        following_list.append(row[0])
    return make_response(jsonify({'followingArr': following_list}), 200)


@app.route('/user/<int:user_id>/followers', methods=['GET'])
@jwt_required
def get_followers(user_id):
    """
    Obtain the list of ids of the users that follow the user of user_id
    :param user_id:
    """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT follower_id, username FROM ' \
              '(SELECT follower_id FROM tbl_follow WHERE followed_id = %s) tbl_user_follow ' \
              'INNER JOIN tbl_user ON follower_id = user_id'
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()
    follower_list = []
    for row in query_result:
        follower_list.append(row[0])
    return make_response(jsonify({'followerArr': follower_list}), 200)


@app.route('/post/<int:post_id>/like', methods=['POST'])
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


@app.route('/post/<int:post_id>/like', methods=['DELETE'])
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


@app.route('/post/<int:post_id>/like', methods=['GET'])
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


@app.route('/post/<int:post_id>/bookmark', methods=['POST'])
@jwt_required
def bookmark_post(post_id):
    pass


@app.route('/post/<int:post_id>/bookmark', methods=['DELETE'])
@jwt_required
def remove_bookmark(post_id):
    pass


@app.route('/post/<int:post_id>/comment', methods=['POST'])
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


@app.route('/post/<int:post_id>/comment', methods=['GET'])
@jwt_required
def get_post_comments(post_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT comment_id, user_id, username, comment_date, content ' \
              'FROM (SELECT * FROM tbl_comment WHERE post_id = %s) tbl_post_comment ' \
              'NATURAL JOIN tbl_user ' \
              'ORDER BY comment_date DESC'
        cursor.execute(sql, (post_id, ))
        query_result = cursor.fetchall()
    comment_preview_list = [
    ]  # choose the two most recent comments for preview
    for idx, row in enumerate(query_result):
        if idx < 2:
            comment = {
                'commentId': row[0],
                'userId': row[1],
                'username': row[2],
                'commentDate': row[3],
                'commentContent': row[4]
            }
            comment_preview_list.append(comment)
    comment_preview_list.reverse()
    return make_response(
        jsonify({
            'commentPreviewArr': comment_preview_list,
            'commentCnt': len(query_result)
        }), 200)


@app.route('/comment/<int:comment_id>', methods=['PUT'])
@jwt_required
def edit_comment(comment_id):
    pass


@app.route('/comment/<int:comment_id>', methods=['DELETE'])
@jwt_required
def delete_comment(comment_id):
    pass


@app.route('/comment/<int:comment_id>/reply',
           methods=['GET', 'POST', 'DELETE', 'PUT'])
@jwt_required
def comment_reply(comment_id):
    if request.method == 'GET':
        pass

    elif request.method == 'POST':
        pass
