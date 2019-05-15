# Helper functions for song module

import flask


def get_similar_songs(partial_song_name):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT song_name, artist ' \
              'FROM tbl_song_info ' \
              'WHERE song_name LIKE %s'
        cursor.execute(sql, (partial_song_name + '%', ))
        query_result = cursor.fetchall()

    if len(query_result) < 1:
        return None

    similar_songs = []
    for item in query_result:
        similar_songs.append(tuple(item))

    return tuple(similar_songs)
