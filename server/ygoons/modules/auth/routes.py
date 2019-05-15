import os
import binascii

import flask
from flask import request, jsonify, abort, make_response
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required,
                                get_jwt_identity)

from ygoons.authentication import hash_password, verify_password

from ygoons.modules.auth import blueprint, helpers


# TODO - add token blacklist and use the refreshing functionality
@blueprint.route('/refresh', methods=['POST'])
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


# TODO: account module?
# TODO - check if the username or something already exists
#      - Error handling
#      - what if tbl_user_info does not get filled
@blueprint.route('/signup', methods=['POST'])
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
@blueprint.route('/signin', methods=['POST'])
def sign_in():
    email = request.args.get('email')
    password = request.args.get('password')
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT user_id, username FROM tbl_user ' \
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


@blueprint.route('/signup/facebook', methods=['POST'])
def sign_up_facebook():
    user_access_token = request.headers.get('Facebook-Access-Token')
    email = request.args.get('email')
    username = request.args.get('username')

    facebook_id = helpers.get_facebook_id(user_access_token)
    if facebook_id is None:
        return make_response(
            jsonify({'msg': 'Error during Facebook authentication'}))

    # for facebook auth, fill password with randomly generated string
    # TODO: check if this is a good practice
    print(int(facebook_id))
    password = binascii.b2a_hex(os.urandom(96)).decode('ascii')
    with flask.g.pymysql_db.cursor() as cursor:
        sql = "INSERT INTO tbl_user (email, username, password, facebook_id) " \
              "VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (email, username, password, facebook_id))
        user_id = cursor.lastrowid
        user_info_rowcnt = 0
        if user_id:
            # create a row in tbl_user_info for the newly registered user
            sql = "INSERT INTO tbl_user_info (user_id) " \
                  "VALUES (%s)"
            user_info_rowcnt = cursor.execute(sql, (user_id, ))

    if user_id and user_info_rowcnt:
        flask.g.pymysql_db.commit()
        return make_response(jsonify({'success': True}), 200)
    else:
        return make_response(jsonify({'msg': "New user not added"}), 400)


@blueprint.route('/signin/facebook', methods=['POST'])
def sign_in_facebook():
    """ Sign in using Facebook access token passed as the header
        Assume facebook_id is already stored in database which is checked
        by get_user_exists_by_facebook_id function before being called
    """
    user_access_token = request.headers.get('Facebook-Access-Token')

    facebook_id = helpers.get_facebook_id(user_access_token)
    if facebook_id is None:
        return make_response(jsonify({'user': None}), 200)

    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT user_id, username FROM tbl_user ' \
              'WHERE facebook_id = %s'
        cursor.execute(sql, (facebook_id, ))
        query_result = cursor.fetchall()

    if len(query_result) != 1:
        return make_response(jsonify({'user': None}), 200)

    user = {'user_id': query_result[0][0], 'username': query_result[0][1]}

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


@blueprint.route('/signout', methods=['POST'])
def sign_out():
    return make_response(jsonify({'success': True}), 200)
