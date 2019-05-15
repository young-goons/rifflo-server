from flask import Blueprint
blueprint = Blueprint('song', __name__)

import ygoons.modules.song.routes
