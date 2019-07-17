from flask import Blueprint
blueprint = Blueprint('auth', __name__)

import ygoons.modules.auth.routes
