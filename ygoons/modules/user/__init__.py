from flask import Blueprint
blueprint = Blueprint('user', __name__)

import ygoons.modules.user.routes
