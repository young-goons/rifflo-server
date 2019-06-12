# Helper functions for post module

import flask


def get_post_data(id_list):
    """ Obtains the post data of posts with ids given by input id_list """

    with flask.g.pymysql_db.cursor() as cursor:
        fmt_str = ','.join(['%s'] * len(id_list))
        sql = '''
        SELECT
            post_id, user_id, username, upload_date, content, tags,
            song_id, clip_path, song_name, artist,
            spotify_url, applemusic_url, youtube_url, soundcloud_url, bandcamp_url, other_url
        FROM (
            SELECT * FROM tbl_post
            WHERE post_id IN (%s)
        ) tbl_post_id
        NATURAL JOIN (
            SELECT user_id, username FROM tbl_user
        ) tbl_user_id
        NATURAL JOIN tbl_song_info
        ''' % fmt_str
        cursor.execute(sql, tuple(id_list))
        query_result = cursor.fetchall()
    post_dict = {}
    for row in query_result:
        post_data = {
            'postId': row[0],
            'userId': row[1],
            'username': row[2],
            'uploadDate': row[3],
            'content': row[4],
            'tags': row[5],
            'songId': row[6],
            'clipPath': row[7],
            'songName': row[8],
            'artist': row[9],
            'urlObj': {
                'spotifyUrl': row[10],
                'applemusic_url': row[11],
                'youtubeUrl': row[12],
                'soundcloudUrl': row[13],
                'bandcampUrl': row[14],
                'otherUrl': row[15]
            }
        }
        post_dict[row[0]] = post_data
    return post_dict


def upload_song_info(song_id, request_form):
    if song_id is None:  # check if the input song exists or not
        with flask.g.pymysql_db.cursor() as cursor:
            sql = '''
            SELECT song_id
            FROM tbl_song_info
            WHERE song_name = %s AND artist = %s
            '''
            cursor.execute(sql,
                           (request_form['track'], request_form['artist']))
            query_result = cursor.fetchone()
        if query_result is not None:
            song_id = query_result[0]

    if song_id is None:  # insert into tbl_song_info
        with flask.g.pymysql_db.cursor() as cursor:
            sql = '''
            INSERT INTO tbl_song_info (
                song_name, artist, spotify_url, youtube_url, applemusic_url, soundcloud_url, bandcamp_url
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            '''
            cursor.execute(
                sql,
                (request_form['track'], request_form['artist'],
                 request_form['spotifyUrl'], request_form['youtubeUrl'],
                 request_form['applemusicUrl'], request_form['soundcloudUrl'],
                 request_form['bandcampUrl']))
            song_id = cursor.lastrowid
    else:  # update song info in tbl_song_info only for empty columns
        with flask.g.pymysql_db.cursor() as cursor:
            sql = '''
            SELECT spotify_url, youtube_url, applemusic_url, soundcloud_url, bandcamp_url
            FROM tbl_song_info
            WHERE song_id = %s
            '''
            cursor.execute(sql, (song_id, ))
            query_result = cursor.fetchone()

        if query_result is None:
            return None
        if query_result[0] is None or query_result[0] == '':
            spotify_url = request_form['spotifyUrl']
        else:
            spotify_url = query_result[0]

        if query_result[1] is None or query_result[1] == '':
            youtube_url = request_form['youtubeUrl']
        else:
            youtube_url = query_result[1]

        if query_result[2] is None or query_result[2] == '':
            applemusic_url = request_form['applemusicUrl']
        else:
            applemusic_url = query_result[2]

        if query_result[3] is None or query_result[3] == '':
            soundcloud_url = request_form['soundcloudUrl']
        else:
            soundcloud_url = query_result[3]

        if query_result[4] is None or query_result[4] == '':
            bandcamp_url = request_form['bandcampUrl']
        else:
            bandcamp_url = query_result[4]

        with flask.g.pymysql_db.cursor() as cursor:
            sql = '''
            UPDATE tbl_song_info
            SET
                spotify_url = %s,
                youtube_url = %s,
                applemusic_url = %s,
                soundcloud_url = %s,
                bandcamp_url = %s
            WHERE song_id = %s
            '''
            cursor.execute(sql, (spotify_url, youtube_url, applemusic_url,
                                 soundcloud_url, bandcamp_url, song_id))
    return song_id


def get_comment_data(post_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT comment_id, user_id, username, comment_date, content
        FROM (
            SELECT * FROM tbl_comment
            WHERE post_id = %s
        ) tbl_post_comment
        NATURAL JOIN tbl_user
        ORDER BY comment_date DESC
        '''
        cursor.execute(sql, (post_id, ))
        query_result = cursor.fetchall()
    return query_result


def upload_post_dislike(post_id, curr_user_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT COUNT(*)
        FROM tbl_dislike
        WHERE post_id = %s AND user_id = %s
        '''
        cursor.execute(sql, (post_id, curr_user_id))
        dislike_exist = cursor.fetchone()[0]

    if dislike_exist:
        return -1

    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        INSERT INTO tbl_dislike (post_id, user_id)
        VALUES (%s, %s)
        '''
        affected_row_cnt = cursor.execute(sql, (post_id, curr_user_id))

    return affected_row_cnt


def delete_post_dislike(post_id, curr_user_id):
    """ Delete user's dislike record on a post. User can only dislike the post once.
        Assume disliked post never appears again
    """

    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'DELETE FROM tbl_dislike WHERE post_id = %s AND user_id = %s'
        affected_row_cnt = cursor.execute(sql, (post_id, curr_user_id))

    return affected_row_cnt


def upload_post_report(post_id, curr_user_id, content):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        INSERT INTO tbl_post_report (post_id, user_id, content)
        VALUES (%s, %s, %s)
        '''
        affected_row_cnt = cursor.execute(sql,
                                          (post_id, curr_user_id, content))

    return affected_row_cnt
