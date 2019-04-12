import re
import datetime
import random

from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity)

import dummy_data

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'abcdef'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)

jwt = JWTManager(app)


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return make_response(jsonify({
        'success': False,
        'message': 'Missing Authorization Header'
    }), 401)


@app.route('/signup')
def sign_up():
    pass


@app.route('/signin', methods=['POST'])
def sign_in():
    # validate user
    email = request.args.get('email')
    password = request.args.get('password')
    user = dummy_data.users[1]
    user_id = user['user_id']
    username = user['username']

    access_token = create_access_token(identity={'userId': user_id, 'username': username})
    refresh_token = create_refresh_token(identity={'userId': user_id, 'username': username})
    user['access_token'] = access_token
    user['refresh_token'] = refresh_token
    return make_response(jsonify({'user': user}), 200)


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


@app.route('/user/<int:user_id>/info', methods=['GET'])
@jwt_required
def get_user_info(user_id):
    # check if the identity of the token is equal to the identity of the request parameter
    # TODO: distinguish public and private info
    if user_id == get_jwt_identity()['userId']:
        user = dummy_data.users[user_id]
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


@app.route('/user/upload/post', methods=['POST'])
@jwt_required
def upload_post():
    user = get_jwt_identity()
    user_id = user['userId']
    content = request.args.get('content')
    tags = request.args.get('tags')
    post_id = 3
    return make_response(jsonify({'postId': post_id}), 200)


@app.errorhandler(400)
def bad_params(error):
    return make_response(jsonify({'msg': 'Bad parameters'}), 400)


if __name__ == '__main__':
    app.run(debug=True)