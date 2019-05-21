# Helper functions for user module

import flask
from ygoons.modules.user import follow_suggest


def get_user_data(user_id, private=False):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT user_id, username, email, name, location, profile_picture_path ' \
              'FROM tbl_user NATURAL JOIN' \
              '(SELECT * FROM tbl_user_info WHERE user_id = %s) tbl_user_info_id'
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()

    if len(query_result) != 1:
        return None

    user = {
        'userId': query_result[0][0],
        'username': query_result[0][1],
        'name': query_result[0][3],
        'location': query_result[0][4],
        'profile_picture_path': query_result[0][5]
    }

    if private:
        user['email'] = query_result[0][2]

    return user


def update_username(user_id, username):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'UPDATE tbl_user SET username = %s WHERE user_id = %s'
        row_cnt = cursor.execute(sql, (username, user_id))

    return row_cnt


def update_user_info(user_id, updated_data):
    row_cnt = 0
    with flask.g.pymysql_db.cursor() as cursor:
        if 'name' in updated_data:
            sql = 'UPDATE tbl_user_info SET name = %s WHERE user_id = %s'
            row_cnt += cursor.execute(sql, (updated_data['name'], user_id))
        if 'location' in updated_data:
            sql = 'UPDATE tbl_user_info SET location = %s WHERE user_id = %s'
            row_cnt += cursor.execute(sql, (updated_data['location'], user_id))

    return row_cnt


def upload_profile_picture(user_id, profile_img_path):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = "UPDATE tbl_user_info SET profile_picture_path = %s WHERE user_id = %s"
        row_cnt = cursor.execute(sql, (profile_img_path, user_id))

    return row_cnt


def get_profile_picture_path(user_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT profile_picture_path FROM tbl_user_info WHERE user_id = %s'
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()

    if len(query_result) != 1:
        return None

    return query_result[0][0]


def delete_profile_picture(user_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'UPDATE tbl_user_info SET profile_picture_path = NULL WHERE user_id = %s'
        row_cnt = cursor.execute(sql, (user_id, ))

    return row_cnt


def upload_header_picture(user_id, background_img_path):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = "UPDATE tbl_user_info SET header_picture_path = %s WHERE user_id = %s"
        row_cnt = cursor.execute(sql, (background_img_path, user_id))

    return row_cnt


def get_header_picture_path(user_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT header_picture_path FROM tbl_user_info WHERE user_id = %s'
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()

    if len(query_result) != 1:
        return None

    return query_result[0][0]


def delete_header_picture(user_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'UPDATE tbl_user_info SET header_picture_path = NULL WHERE user_id = %s'
        row_cnt = cursor.execute(sql, (user_id, ))

    return row_cnt


def get_user_play_history(user_id):
    """ Obtains the list of song information that the user played """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT song_id, song_name, artist, play_date, ' \
              'spotify_url, youtube_url, soundcloud_url, bandcamp_url FROM ' \
              '(SELECT post_id, play_date FROM tbl_play_history WHERE user_id = %s) tbl_user_play NATURAL JOIN ' \
              'tbl_post NATURAL JOIN tbl_song_info ORDER BY play_date DESC'
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()

    play_list = []
    for row in query_result:
        play_dict = {
            'songId': row[0],
            'songName': row[1],
            'artist': row[2],
            'date': row[3],
            'spotifyUrl': row[4],
            'youtubeUrl': row[5],
            'soundcloudUrl': row[6],
            'bandcampUrl': row[7]
        }
        play_list.append(play_dict)

    return play_list


def get_user_full_song_history(user_id):
    """ Obtains the list of full songs the user played """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT song_id, song_name, artist, listen_date, ' \
              'spotify_url, youtube_url, soundcloud_url, bandcamp_url FROM ' \
              '(SELECT post_id, listen_date FROM tbl_full_song_history WHERE user_id = %s) tbl_user_play ' \
              'NATURAL JOIN tbl_post NATURAL JOIN tbl_song_info ORDER BY listen_date DESC'
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()

    full_song_list = []
    for row in query_result:
        full_song_dict = {
            'songId': row[0],
            'songName': row[1],
            'artist': row[2],
            'date': row[3],
            'spotifyUrl': row[4],
            'youtubeUrl': row[5],
            'soundcloudUrl': row[6],
            'bandcampUrl': row[7]
        }
        full_song_list.append(full_song_dict)

    return full_song_list


def get_user_disliked(user_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT song_id, post_id, song_name, artist, dislike_date, ' \
              'spotify_url, youtube_url, soundcloud_url, bandcamp_url FROM ' \
              '(SELECT post_id, dislike_date FROM tbl_dislike WHERE user_id = %s) tbl_user_dislike NATURAL JOIN ' \
              'tbl_post NATURAL JOIN tbl_song_info ORDER BY dislike_date DESC'
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()

    dislike_list = []
    for row in query_result:
        dislike_dict = {
            'songId': row[0],
            'postId': row[1],
            'songName': row[2],
            'artist': row[3],
            'date': row[4],
            'spotifyUrl': row[5],
            'youtubeUrl': row[6],
            'soundcloudUrl': row[7],
            'bandcampUrl': row[8]
        }
        dislike_list.append(dislike_dict)

    return dislike_list


def get_user_suggest_follow(user_id):
    user_id_list = follow_suggest.get_suggest_follow(user_id,
                                                     flask.g.pymysql_db)
    return user_id_list
