import flask

from ygoons.testing.fixtures import tester
from ygoons import app

from ygoons.modules.user.helpers import get_user_suggest_follow


def test_get_user_suggest_follow(tester):
    # 7, 8, 9, 10, 11 do not have attribute data
    assert get_user_suggest_follow(1) == [5, 4]
    assert get_user_suggest_follow(2) == [6]
    assert get_user_suggest_follow(3) == [6]
    assert get_user_suggest_follow(4) == []
    assert get_user_suggest_follow(7) == [2, 6]
    assert get_user_suggest_follow(8) == [4]
    assert get_user_suggest_follow(9) == [5]
