import re
import datetime
import random
import os

from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity)
import pymysql

from authentication import hash_password, verify_password
import dummy_data

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'abcdef'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
jwt = JWTManager(app)

connection = pymysql.connect(host='localhost', port=3306, user='root',
                             passwd=os.environ['db_password'], db='music_app')

@jwt.unauthorized_loader
def unauthorized_response(callback):
    return make_response(jsonify({
        'success': False,
        'message': 'Missing Authorization Header'
    }), 401)

# TODO - check if the username or something already exists
#      - Error handling
#      - what if tbl_user_info does not get filled
@app.route('/signup', methods=['POST'])
def sign_up():
    email = request.args.get('email')
    username = request.args.get('username')
    password = request.args.get('password')
    with connection.cursor() as cursor:
        sql = "INSERT INTO tbl_user (email, username, password) " \
              "VALUES (%s, %s, %s)"
        cursor.execute(sql, (email, username, hash_password(password)))
        user_id = cursor.lastrowid
        user_info_rowcnt = 0
        if user_id:
            sql = "INSERT INTO tbl_user_info (user_id)" \
                  "VALUES (%s)"
            user_info_rowcnt = cursor.execute(sql, (user_id))

    if user_id and user_info_rowcnt:
        connection.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "New user not added"}), 400)

# TODO - action when signin is denied i.e. when wrong password e.t.c
@app.route('/signin', methods=['POST'])
def sign_in():
    # validate user
    email = request.args.get('email')
    password = request.args.get('password')
    with connection.cursor() as cursor:
        sql = "SELECT user_id, username, password FROM tbl_user " \
              "WHERE email = %s"
        cursor.execute(sql, (email))
        query_result = cursor.fetchall()

    if len(query_result) != 1:
        return make_response(jsonify({'msg': "Error while fetching user data"}), 400)

    user = {
        'user_id': query_result[0][0],
        'username': query_result[0][1],
    }

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
        return make_response(jsonify({'msg': 'Wrong Password'}), 400)


@app.route('/signout', methods=['POST'])
def sign_out():
    return make_response(jsonify({'success': True}), 200)


@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    curr_user_id = get_jwt_identity()
    ret = {
        'token': create_access_token(identity={})
    }
    return make_response(jsonify({ret}), 200)

# TODO: distinguish public and private info
@app.route('/user/<int:user_id>/info', methods=['GET'])
@jwt_required
def get_user_info(user_id):
    # check if the identity of the token is equal to the identity of the request parameter
    if user_id == get_jwt_identity()['userId']:
        with connection.cursor() as cursor:
            sql = "SELECT user_id, username, email, following_count, follower_count, " \
                  "profile_picture_path FROM tbl_user NATURAL JOIN tbl_user_info " \
                  "WHERE user_id = %s"
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


@app.route('/user/<int:user_id>/posts', methods=['GET'])
def get_user_posts(user_id):
    """ Obtains the list of ids of the posts that the user has posted """
    # TODO: add shuffle option
    post_id_list = dummy_data.user_posts[user_id]
    return make_response(jsonify({'postIdArr': post_id_list}), 200)


@app.route('/user/feed', methods=['GET'])
@jwt_required
def get_user_feed():
    """ Obtains the list of post_ids to appear on the user feed
        and sends the list of ids to the client """
    user_id = get_jwt_identity()['userId']
    post_id_list = dummy_data.user_feed[user_id]
    random.shuffle(post_id_list)
    return make_response(jsonify({'postIdArr': post_id_list}), 200)


@app.route('/posts/<id_list>', methods=['GET'])
def get_posts(id_list):
    """
    :param id_list: list of integer ids separated by ,
    :return:
    """
    if not re.match(r'^\d+(?:,\d+)*,?$', id_list):
        abort(400)
    post_id_list = [int(i) for i in id_list.split(',')]
    post_list = list(map(lambda x: dummy_data.posts[x], post_id_list))
    return make_response(jsonify({'postArr': post_list}), 200)


@app.route('/user/upload/song', methods=['POST'])
@jwt_required
def upload_song():
    pass


@app.route('/user/upload/post', methods=['POST'])
@jwt_required
def upload_post():
    user = get_jwt_identity()
    user_id = user['userId']
    content = request.args.get('content')
    tags = request.args.get('tags')

    # temporary data for now
    clip_path = ''
    song_name = "abc"
    artist = "def"

    with connection.cursor() as cursor:
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
        connection.commit()
        return make_response(jsonify({'postId': post_id, 'songId': song_id}), 200)
    else:
        return make_response(jsonify({'msg': 'Error uploading post and song'}), 400)


@app.errorhandler(400)
def bad_params(error):
    return make_response(jsonify({'msg': 'Bad parameters'}), 400)


if __name__ == '__main__':
    app.run(debug=True)