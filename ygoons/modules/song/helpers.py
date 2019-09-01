# Helper functions for song module

import flask
from datetime import datetime


def get_similar_songs(partial_title, partial_artist):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT
            song_id, song_name, artist,
            spotify_url, applemusic_url, youtube_url, soundcloud_url, bandcamp_url
        FROM tbl_song_info
        WHERE song_name LIKE %s AND artist LIKE %s
        '''
        cursor.execute(sql, (partial_title + '%', partial_artist + '%'))
        query_result = cursor.fetchall()

    if len(query_result) < 1:
        return ()

    similar_songs = []
    for item in query_result:
        similar_songs.append(tuple(item))
    # similar_songs = tuple(similar_songs)

    return similar_songs


def get_song_info(title, artist):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT
            song_id, song_name, artist, album, release_date, spotify_url, applemusic_url, youtube_url,
            soundcloud_url, bandcamp_url, other_url
        FROM tbl_song_info
        WHERE song_name = %s AND artist = %s
        '''
        cursor.execute(sql, (title, artist))
        query_result = cursor.fetchone()

    if query_result is None:
        song_info = None
    else:
        song_info = {
            'song_id': query_result[0],
            'track': query_result[1],
            'artist': query_result[2],
            'album': query_result[3],
            'release_date': query_result[4],
            'spotifyUrl': query_result[5],
            'applemusicUrl': query_result[6],
            'youtubeUrl': query_result[7],
            'soundcloudUrl': query_result[8],
            'bandcampUrl': query_result[9],
            'otherUrl': query_result[10]
        }

    return song_info


def upload_song_info(song_info):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        INSERT INTO tbl_song_info (song_name, artist, album, spotify_url, applemusic_url, 
                                   youtube_url, soundcloud_url, bandcamp_url, other_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(sql, (song_info['track'], song_info['artist'], song_info['album'],
                             song_info['spotifyUrl'], song_info['applemusicUrl'], song_info['youtubeUrl'],
                             song_info['soundcloudUrl'], song_info['bandcampUrl'], song_info['otherUrl']))
        song_id = cursor.lastrowid
    return song_id


def upload_user_song(song_id, user_id, song_path):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        INSERT INTO tbl_user_song (song_id, user_id, song_path)
        VALUES (%s, %s, %s)
        '''
        affected_row_cnt = cursor.execute(sql, (song_id, user_id, song_path))
    flask.g.pymysql_db.commit()
    return affected_row_cnt


def update_song_info(song_id, new_song_info):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        UPDATE tbl_song_info
        SET 
            album = %s,
            spotify_url = %s,
            youtube_url = %s,
            soundcloud_url = %s,
            bandcamp_url = %s,
            applemusic_url = %s,
            other_url = %s
        WHERE song_id = %s
        '''
        cursor.execute(sql, (new_song_info['album'], new_song_info['spotifyUrl'], new_song_info['youtubeUrl'],
                             new_song_info['soundcloudUrl'], new_song_info['bandcampUrl'],
                             new_song_info['applemusicUrl'], new_song_info['otherUrl'], song_id))


def record_song_info_history(song_id, user_id, updated_song_info):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        INSERT INTO tbl_song_info_history (
            song_id, user_id, song_name, artist, album,
            spotify_url, youtube_url, soundcloud_url, bandcamp_url, applemusic_url, other_url
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(sql, (song_id, user_id, updated_song_info['track'], updated_song_info['artist'],
                             updated_song_info['album'], updated_song_info['spotifyUrl'],
                             updated_song_info['youtubeUrl'], updated_song_info['soundcloudUrl'],
                             updated_song_info['bandcampUrl'], updated_song_info['applemusicUrl'],
                             updated_song_info['otherUrl']))
