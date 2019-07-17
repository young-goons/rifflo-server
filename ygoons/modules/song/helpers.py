# Helper functions for song module

import flask


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
