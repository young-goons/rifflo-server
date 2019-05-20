import flask

from ygoons.testing.fixtures import tester
from ygoons import app

from ygoons.modules.user.helpers import get_user_suggest_follow


def test_get_user_suggest_follow(tester):
    assert get_user_suggest_follow(1) == [4, 5]
