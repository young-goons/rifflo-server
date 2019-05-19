# Helper functions for post module

import flask


def upload_post_dislike(post_id, curr_user_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'INSERT INTO tbl_dislike (post_id, user_id) ' \
              'VALUES (%s, %s)'
        affected_row_cnt = cursor.execute(sql, (post_id, curr_user_id))

    return affected_row_cnt


def delete_post_dislike(post_id, curr_user_id):
    """ Delete user's dislike record on a post """
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'DELETE FROM tbl_dislike WHERE post_id = %s AND user_id = %s'
        affected_row_cnt = cursor.execute(sql, (post_id, curr_user_id))

    return affected_row_cnt
