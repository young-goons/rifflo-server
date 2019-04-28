import random

import flask
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity

from ygoons.modules.user import blueprint, helpers

# TODO: distinguish public and private info
@blueprint.route('/user/<int:user_id>/info', methods=['GET'])
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
            cursor.execute(sql, (user_id, ))
            query_result = cursor.fetchall()

        if len(query_result) != 1:
            return make_response(
                jsonify({'msg': 'Error fetching user info data'}), 400)

        user = {
            'userId': query_result[0][0],
            'username': query_result[0][1],
            'email': query_result[0][2],
            'following_count': query_result[0][3],
            'follower_count': query_result[0][4],
            'profile_picture_path': query_result[0][5]
        }
        return make_response(jsonify({'user': user}), 200)
    else:
        return make_response(
            jsonify({'msg': 'No authentication on requested data'}), 400)


@blueprint.route('/user/id/username/<string:username>', methods=['GET'])
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


@blueprint.route('/user/<int:user_id>/posts', methods=['GET'])
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


@blueprint.route('/user/feed', methods=['GET'])
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
