import flask

from ygoons.testing.fixtures import tester
from ygoons import app

import ygoons.modules.user.helpers as helpers


def test_get_user_data(tester):
    assert helpers.get_user_data(1, private=True) == {
        'userId': 1,
        'username': 'johnguackmbl',
        'email': 'johnguackmbl@gmail.com',
        'profile_picture_path': None,
        'name': None,
        'location': None
    }

    assert helpers.get_user_data(1, private=False) == {
        'userId': 1,
        'username': 'johnguackmbl',
        'profile_picture_path': None,
        'name': None,
        'location': None
    }
