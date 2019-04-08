import re

from flask import Flask, request, jsonify, abort, make_response

app = Flask(__name__)


@app.route('/signup')
def sign_up():
    pass


@app.route('/signin')
def sign_in():
    pass


@app.route('/user/info', methods=['GET'])
def get_user_info():
    pass


@app.route('/user/posts', methods=['GET'])
def get_user_posts():
    """ Obtains the list of post_ids that the user has posted """
    post_id_list = []
    return jsonify({'post_id_list': post_id_list})


@app.route('/user/feed', methods=['GET'])
def get_user_feed():
    """ Obtains the list of post_ids to appear on the user feed """
    pass


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
    return jsonify({'post_list': post_list})


@app.route('/user/upload/post', methods=['POST'])
def upload_post():
    pass


@app.errorhandler(400)
def bad_params(error):
    return make_response(jsonify({'error': 'Bad parameters'}), 400)


if __name__ == '__main__':
    app.run(debug=True)