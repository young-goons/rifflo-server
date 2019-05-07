import flask

from ygoons.testing.fixtures import tester
from ygoons import app

from ygoons.modules.user.helpers import get_user_data


def test_get_user_data(tester):
    assert get_user_data(1) == {
        'userId': 1,
        'username': 'johnguackmbl',
        'email': 'johnguackmbl@gmail.com',
        'profile_picture_path': None
    }
