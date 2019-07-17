from flask import Blueprint
blueprint = Blueprint('clip', __name__)

import ygoons.modules.clip.routes
