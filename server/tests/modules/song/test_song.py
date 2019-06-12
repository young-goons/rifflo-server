import flask

from ygoons.testing.fixtures import tester
from ygoons import app

from ygoons.modules.song.helpers import get_similar_songs


def test_get_similar_songs(tester):
    # Test title matching
    assert get_similar_songs('He', '') == [
        (3, 'Hello', 'Adele', 'www.spotify.com/3', None, 'www.youtube.com/3',
         None, None),
        (4, 'Heartless', 'Kanye West', 'www.spotify.com/4', None,
         'www.youtube.com/4', None, None)
    ]
    assert get_similar_songs('Photo', '') == [
        (2, 'Photograph', 'Ed Sheeran', 'www.spotify.com/2', None,
         'www.youtube.com/2', None, None)
    ]
    assert get_similar_songs('Anim', '') == [
        (1, 'Animals', 'Maroon 5', 'www.spotify.com/1', None,
         'www.youtube.com/1', None, None)
    ]

    # Test artist matching
    assert get_similar_songs('', 'Maro') == [
        (1, 'Animals', 'Maroon 5', 'www.spotify.com/1', None,
         'www.youtube.com/1', None, None)
    ]

    # Test title + artist matching
    assert get_similar_songs('Photo', 'Ed Sh') == [
        (2, 'Photograph', 'Ed Sheeran', 'www.spotify.com/2', None,
         'www.youtube.com/2', None, None)
    ]
