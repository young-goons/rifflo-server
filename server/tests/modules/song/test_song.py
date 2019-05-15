import flask

from ygoons.testing.fixtures import tester
from ygoons import app

from ygoons.modules.song.helpers import get_similar_songs


def test_get_similar_songs(tester):
    assert get_similar_songs('He') == (('Hello', 'Adele'), ('Heartless',
                                                            'Kanye West'))
