import re
import datetime

from flask import Flask, request, jsonify, abort, make_response
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity)

import dummy_data

app = Flask(__name__)
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
    # get userinfo from database
    user = dummy_data.user
    user_id = user['user_id']

    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    user['token'] = access_token
    user['refresh'] = refresh_token
    return make_response(jsonify({'success': True, 'data': user}), 200)


@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    curr_user_id = get_jwt_identity()
    ret = {
        'token': create_access_token(identity=curr_user_id)
    }
    return make_response(jsonify({'data': ret}), 200)


@app.route('/user/info/<int:user_id>', methods=['GET'])
@jwt_required
def get_user_info(user_id):
    # check if the identity of the token is equal to the identity of the request parameter
    # TODO: distinguish public and private info
    if user_id == get_jwt_identity():
        user = dummy_data.user
        return make_response(jsonify({'data': user}), 200)
    else:
        return make_response(jsonify({'msg': 'No authentication on requested data'}), 400)


@app.route('/user/posts', methods=['GET'])
def get_user_posts():
    """ Obtains the list of post_ids that the user has posted """
    post_id_list = [dummy_data.post1, dummy_data.post2]
    return make_response(jsonify({'data': post_id_list}), 200)


@app.route('/user/feed', methods=['GET'])
def get_user_feed():
    """ Obtains the list of post_ids to appear on the user feed """
    post_id_list = [dummy_data.post2]
    return make_response(jsonify({'data': post_id_list}), 200)


@app.route('/posts/<id_list>', methods=['GET'])
def get_posts(id_list):
    """
    :param id_list: list of integer ids separated by ,
    :return:
    """
    if not re.match(r'^\d+(?:,\d+)*,?$', id_list):
        abort(400)
    post_id_list = [int(i) for i in id_list.split(',')]
    post_list = post_id_list
    return make_response(jsonify({'data': post_list}), 200)


@app.route('/user/upload/post', methods=['POST'])
def upload_post():
    pass


@app.errorhandler(400)
def bad_params(error):
    return make_response(jsonify({'msg': 'Bad parameters'}), 400)


if __name__ == '__main__':
    app.run(debug=True)