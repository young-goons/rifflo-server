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
