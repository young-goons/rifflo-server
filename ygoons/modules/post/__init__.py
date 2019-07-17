from flask import Blueprint
blueprint = Blueprint('post', __name__)

import ygoons.modules.post.routes
