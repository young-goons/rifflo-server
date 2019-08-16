import os
import binascii

import flask
from flask import request, jsonify, abort, make_response
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required,
                                get_jwt_identity)

from ygoons.authentication import hash_password, verify_password
from ygoons.utils import aws_amplify_login_required

from ygoons.modules.auth import blueprint, helpers


@blueprint.route('/auth/info', methods=['GET'])
@aws_amplify_login_required
def get_auth_info():
    user_id = request.user['user_id']
    email = request.user['email']

    auth_user = helpers.get_auth_info(user_id, email)
    if auth_user is None:
        abort(make_response("Auth User Loading Error", 400))
    else:
        return make_response(jsonify({'authUser': auth_user}), 200)
