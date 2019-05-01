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


# TODO: account module?
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
