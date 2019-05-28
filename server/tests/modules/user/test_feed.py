import flask

from ygoons.testing.fixtures import tester
from ygoons import app

from ygoons.modules.user.helpers import get_user_feed


def test_get_user_suggest_follow(tester):
    assert get_user_feed(1) == [3, 4, 2]
    assert get_user_feed(2) == [1, 3, 4, 5]
    assert get_user_feed(3) == [1, 4, 5, 2]
    assert get_user_feed(4) == [1, 3, 5, 2]
    assert get_user_feed(5) == [1, 3, 5, 4, 2]
