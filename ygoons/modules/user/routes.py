import random
import json
import os

import flask
from flask import request, jsonify, make_response, abort, send_from_directory
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import boto3
from botocore.exceptions import ClientError

from ygoons.utils import aws_amplify_login_required

from ygoons.modules.user import blueprint, helpers, feed, svd


# TODO: distinguish public and private info
@blueprint.route('/user/<int:user_id>/info', methods=['GET'])
@jwt_required
def get_user_info(user_id):
    """
    Fetches and returns user information stored in tbl_user_info
    user_id, username, email, profile_picture_path returned
    :param user_id: user_id of request
    """
    # check if the identity of the token is equal to the identity of the request parameter
    private = user_id == get_jwt_identity()['userId']
    user = helpers.get_user_data(user_id, private=private)
    if user is None:
        return make_response(jsonify({'msg': 'Error fetching user info data'}),
                             400)
    else:
        return make_response(jsonify({'user': user}), 200)


@blueprint.route('/user/<string:user_id>/info', methods=['PUT'])
@aws_amplify_login_required
def update_user_info(user_id):
    """
    Updates user information stored in tbl_user and tbl_user_info
    :param user_id: user_id of request
    """
    if request.user['user_id'] != user_id:
        return abort(403)

    updated_data = json.loads(request.data)

    if 'username' in updated_data:
        username_updated = helpers.update_username(user_id, updated_data['username'])
        del updated_data['username']
    else:
        username_updated = True # dummy value for check later

    row_cnt = 0
    if len(updated_data) > 0:
        row_cnt += helpers.update_user_info(user_id, updated_data)

    if username_updated and row_cnt == len(updated_data):
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': 'User Info Update Failed'}), 400)


@blueprint.route('/user/username/<string:username>', methods=['GET'])
@aws_amplify_login_required
def get_user_by_username(username):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT user_id, username, username_set, email, name, location
        FROM tbl_user NATURAL JOIN tbl_user_info
        WHERE username = %s
        '''
        cursor.execute(sql, username)
        query_result = cursor.fetchone()
    if query_result is not None:
        user_info = {
            'username_set': query_result[2],
            'email': query_result[3],
            'name': query_result[4],
            'location': query_result[5]
        }
        return make_response(jsonify({'userId': query_result[0], 'userInfo': user_info}), 200)
    else:
        return make_response(jsonify({'userId': None, 'userInfo': None}), 200)


@blueprint.route('/user/username/<string:username>/id', methods=['GET'])
def get_user_id_by_username(username):
    """ Fetches existence of user of the input username and returns user_id if exists
        :param username: username to check existence of
    """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT user_id FROM tbl_user WHERE username = %s
        '''
        cursor.execute(sql, username)
        query_result = cursor.fetchone()
    if query_result is not None:
        return make_response(jsonify({'userId': query_result[0]}), 200)
    else:
        return make_response(jsonify({'userId': None}), 200)


@blueprint.route('/user/id/email/<string:email>', methods=['GET'])
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


@blueprint.route('/user/id/facebook/<string:facebook_id>', methods=['GET'])
def get_user_exists_by_facebook_id(facebook_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT user_id FROM tbl_user WHERE facebook_id = %s'
        cursor.execute(sql, facebook_id)
        query_result = cursor.fetchone()

    if query_result is not None:
        return make_response(jsonify({'userId': query_result[0]}), 200)
    else:
        return make_response(jsonify({'userId': None}), 200)


@blueprint.route('/user/<int:user_id>/posts', methods=['GET'])
@jwt_required
def get_user_posts(user_id):
    """ Obtains the list of ids of the posts that the user has posted """
    shuffle = request.args.get('shuffle')
    post_id_list = helpers.get_user_post_ids(user_id)

    if shuffle:
        random.shuffle(post_id_list)
    return make_response(jsonify({'postIdArr': post_id_list}), 200)


@blueprint.route('/user/feed', methods=['GET'])
@jwt_required
def get_user_feed():
    """ Obtains the list of post_ids to appear on the user feed
        and sends the list of ids to the client """

    user_id = get_jwt_identity()['userId']
    post_id_list = helpers.get_user_feed(user_id)
    return make_response(jsonify({'postIdArr': post_id_list}), 200)


@blueprint.route('/user/<string:user_id>/following', methods=['GET'])
@aws_amplify_login_required
def get_following(user_id):
    """
    Obtain the list of ids of the users that the user of user_id is following
    :param user_id:
    """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT followed_id, username
        FROM (SELECT followed_id FROM tbl_follow WHERE follower_id = %s) tbl_user_follow
        INNER JOIN tbl_user ON followed_id = user_id
        '''
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()

    following_list = []
    for row in query_result:
        following_list.append(row[0])

    return make_response(jsonify({'followingArr': following_list}), 200)


@blueprint.route('/user/<string:user_id>/followers', methods=['GET'])
@aws_amplify_login_required
def get_followers(user_id):
    """
    Obtain the list of ids of the users that follow the user of user_id
    :param user_id:
    """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT follower_id, username
        FROM (SELECT follower_id FROM tbl_follow WHERE followed_id = %s) tbl_user_follow
        INNER JOIN tbl_user ON follower_id = user_id
        '''
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()

    follower_list = []
    for row in query_result:
        follower_list.append(row[0])

    return make_response(jsonify({'followerArr': follower_list}), 200)


@blueprint.route('/user/follow/<string:followed_user_id>', methods=['POST'])
@aws_amplify_login_required
def user_follow(followed_user_id):
    """
    Follow the user of given user_id
    :param followed_user_id: user_id of the user to follow
    """
    if request.user['user_id'] == followed_user_id:
        return abort(400)

    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        INSERT INTO tbl_follow (followed_id, follower_id)
        VALUES (%s, %s)
        '''
        row_cnt = cursor.execute(sql, (followed_user_id, request.user['user_id']))

    if row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "User follow failed"}), 400)


@blueprint.route('/user/follow/<string:followed_user_id>', methods=['DELETE'])
@aws_amplify_login_required
def user_unfollow(followed_user_id):
    """
    Unfollow the user of given user_id
    :param followed_user_id: user_id of the user to unfollow
    """
    if request.user['user_id'] == followed_user_id:
        return abort(400)

    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'DELETE FROM tbl_follow WHERE followed_id = %s AND follower_id = %s'
        row_cnt = cursor.execute(sql, (followed_user_id, request.user['user_id']))

    if row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "User unfollow failed"}), 400)


@blueprint.route('/user/ignore/<int:user_id>', methods=['POST'])
@jwt_required
def user_ignore(user_id):
    curr_user = get_jwt_identity()
    curr_user_id = curr_user['userId']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        INSERT INTO tbl_user_ignore (user_id, ignored_user_id)
        VALUES (%s, %s)
        '''
        affected_row_cnt = cursor.execute(sql, (curr_user_id, user_id))

    if affected_row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "User unfollow failed"}), 400)


@blueprint.route('/user/history/played/<int:post_id>', methods=['POST'])
@jwt_required
def upload_play_history(post_id):
    user_id = get_jwt_identity()['userId']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'INSERT INTO tbl_play_history (user_id, post_id)' \
              'VALUES (%s, %s)'
        row_cnt = cursor.execute(sql, (user_id, post_id))
    if row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'success': False}), 400)


@blueprint.route('/user/history/played_full/<int:post_id>', methods=['POST'])
@jwt_required
def upload_play_full_history(post_id):
    user_id = get_jwt_identity()['userId']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'INSERT INTO tbl_play_full_history (user_id, post_id)' \
              'VALUES (%s, %s)'
        row_cnt = cursor.execute(sql, (user_id, post_id))
    if row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'success': False}), 400)


@blueprint.route('/user/history/full_song/<int:post_id>', methods=['POST'])
@jwt_required
def upload_full_song_history(post_id):
    user_id = get_jwt_identity()['userId']
    service_type = json.loads(request.data)['serviceType']
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'INSERT INTO tbl_full_song_history (user_id, post_id, service_type) ' \
              'VALUES (%s, %s, %s)'
        row_cnt = cursor.execute(sql, (user_id, post_id, service_type))
    if row_cnt == 1:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'success': False}), 400)


@blueprint.route('/user/<string:user_id>/profile/image', methods=['GET'])
@aws_amplify_login_required
def get_user_profile_image_get_url(user_id):
    try:
        url = app.config['S3'].generate_presigned_url(
            'get_object',
            Params={
                'Bucket': app.config['S3_BUCKET_IMAGE'],
                'Key': os.path.join(user_id, 'profileImage.jpeg')
            },
            ExpiresIn=3600)
        return make_response(jsonify({'url': url}), 200)
    except:
        return abort(400)


@blueprint.route('/user/<string:user_id>/profile/image', methods=['POST'])
@aws_amplify_login_required
def get_user_profile_image_post_url(user_id):
    if request.user['user_id'] != user_id:
        return abort(403)

    try:
        res = app.config['S3'].generate_presigned_post(app.config['S3_BUCKET_IMAGE'],
                                                   os.path.join(user_id, 'profileImage.jpeg'))
        return make_response(jsonify({'res': res}), 200)
    except:
        return abort(400)


@blueprint.route('/user/<string:user_id>/profile/image', methods=['DELETE'])
@aws_amplify_login_required
def delete_user_profile_image(user_id):
    if request.user['user_id'] != user_id:
        return abort(403)

    app.config['S3'].delete_object(Bucket=app.config['S3_BUCKET_IMAGE'],
                                   Key=os.path.join(user_id, 'profileImage.jpeg'))
    return make_response(jsonify({'success': True}), 200)


@blueprint.route('/user/<string:user_id>/header/image', methods=['GET'])
@aws_amplify_login_required
def get_user_header_image_get_url(user_id):
    try:
        url = app.config['S3'].generate_presigned_url(
            'get_object',
            Params={
                'Bucket': app.config['S3_BUCKET_IMAGE'],
                'Key': os.path.join(user_id, 'headerImage.jpeg')
            },
            ExpiresIn=100)
        return make_response(jsonify({'url': url}), 200)
    except:
        return abort(400, 'error retrieving header image')


@blueprint.route('/user/<string:user_id>/header/image', methods=['POST'])
@aws_amplify_login_required
def get_user_header_image_post_url(user_id):
    if request.user['user_id'] != user_id:
        return abort(403)

    try:
        res = app.config['S3'].generate_presigned_post(app.config['S3_BUCKET_IMAGE'],
                                                       os.path.join(user_id, 'headerImage.jpeg'))
        return make_response(jsonify({'res': res}), 200)
    except:
        return abort(400, 'error uploading header image')


@blueprint.route('/user/<string:user_id>/header/image', methods=['DELETE'])
@aws_amplify_login_required
def delete_user_header_image(user_id):
    if request.user['user_id'] != user_id:
        return abort(403)

    app.config['S3'].delete_object(Bucket=app.config['S3_BUCKET_IMAGE'],
                                   Key=os.path.join(user_id, 'headerImage.jpeg'))
    return make_response(jsonify({'success': True}), 200)


@blueprint.route('/user/<int:user_id>/played', methods=['GET'])
@jwt_required
def get_user_played(user_id):
    """ Get the list of clip ids that the user played"""
    play_history = helpers.get_user_play_history(user_id)
    return make_response(jsonify({'playArr': play_history}), 200)


@blueprint.route('/user/<int:user_id>/listened', methods=['GET'])
@jwt_required
def get_user_listened(user_id):
    """ Get the list of song ids that the user clicked the full song link """
    full_song_history = helpers.get_user_full_song_history(user_id)
    return make_response(jsonify({'fullSongArr': full_song_history}), 200)


@blueprint.route('/user/<int:user_id>/disliked', methods=['GET'])
@jwt_required
def get_user_dislike(user_id):
    """ Get the list of song ids that the user disliked """
    dislike_history = helpers.get_user_disliked(user_id)
    return make_response(jsonify({'dislikeArr': dislike_history}), 200)


@blueprint.route('/user/suggest_follow', methods=['GET'])
@jwt_required
def get_user_suggest_follow():
    """ Obtains the list of user_ids to make follow suggestion """
    user_id = get_jwt_identity()['userId']

    user_id_list = helpers.get_user_suggest_follow(user_id)
    return make_response(jsonify({'userIdArr': user_id_list}), 200)
