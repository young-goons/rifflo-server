import flask

from ygoons.testing.fixtures import tester
from ygoons import app

from ygoons.modules.song.helpers import get_similar_songs


def test_get_similar_songs(tester):
    # Test title matching
    assert get_similar_songs('He', '') == (('Hello', 'Adele'), ('Heartless',
                                                                'Kanye West'))
    assert get_similar_songs('Photo', '') == (('Photograph', 'Ed Sheeran'), )
    assert get_similar_songs('Anim', '') == (('Animals', 'Maroon 5'), )

    # Test artist matching
    assert get_similar_songs('', 'Maro') == (('Animals', 'Maroon 5'), )

    # Test title + artist matching
    assert get_similar_songs('Photo',
                             'Ed Sh') == (('Photograph', 'Ed Sheeran'), )
