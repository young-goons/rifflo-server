import flask

from ygoons.testing.fixtures import tester
from ygoons import app

import ygoons.modules.post.helpers as helpers


def test_get_post_data(tester):
    post_data = helpers.get_post_data([1, 2])
    assert post_data[1]['userId'] == 1
    assert post_data[1]['username'] == 'user1'
    assert post_data[1]['content'] == 'content1'
    assert post_data[1]['tags'] == 'tags1'
    assert post_data[1]['songId'] == 1
    assert post_data[1]['clipPath'] == './clip_path1'
    assert post_data[1]['songName'] == 'Animals'
    assert post_data[1]['artist'] == 'Maroon 5'
    assert post_data[1]['urlObj']['spotifyUrl'] == 'www.spotify.com/1'
    assert post_data[1]['urlObj']['youtubeUrl'] == 'www.youtube.com/1'

    assert post_data[2]['userId'] == 2
    assert post_data[2]['username'] == 'user2'
    assert post_data[2]['content'] == 'content2'
    assert post_data[2]['tags'] == 'tags2'
    assert post_data[2]['songId'] == 2
    assert post_data[2]['clipPath'] == './clip_path2'
    assert post_data[2]['songName'] == 'Photograph'
    assert post_data[2]['artist'] == 'Ed Sheeran'
    assert post_data[2]['urlObj']['spotifyUrl'] == 'www.spotify.com/2'
    assert post_data[2]['urlObj']['youtubeUrl'] == 'www.youtube.com/2'


def test_get_comment_data(tester):
    comment_list = helpers.get_comment_data(1)
    comment1, comment2, comment3 = comment_list

    assert comment1[0] == 4  # comment_id
    assert comment1[1] == 5  # user_id
    assert comment1[2] == 'user5'  # username
    assert comment1[4] == 'comment3'  # content

    assert comment2[0] == 2
    assert comment2[1] == 3
    assert comment2[2] == 'user3'
    assert comment2[4] == 'comment2'

    assert comment3[0] == 1
    assert comment3[1] == 1
    assert comment3[2] == 'user1'
    assert comment3[4] == 'comment1'
