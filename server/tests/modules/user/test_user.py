import flask

from ygoons.testing.fixtures import tester
from ygoons import app

import ygoons.modules.user.helpers as helpers


def test_get_user_data(tester):
    assert helpers.get_user_data(11, private=True) == {
        'userId': 11,
        'username': 'johnguackmbl',
        'email': 'johnguackmbl@gmail.com',
        'profile_picture_path': None,
        'name': None,
        'location': None
    }

    assert helpers.get_user_data(11, private=False) == {
        'userId': 11,
        'username': 'johnguackmbl',
        'profile_picture_path': None,
        'name': None,
        'location': None
    }


def test_get_user_post_ids(tester):
    post_ids = helpers.get_user_post_ids(1)
    assert set(post_ids) == {1, 5}
