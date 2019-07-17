# Helper functions for comment module

import flask


def get_reply_data(comment_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT
            reply_id, user_id, username, content, reply_date
        FROM tbl_reply NATURAL JOIN tbl_user
        WHERE comment_id = %s
        ORDER BY reply_date ASC
        '''
        cursor.execute(sql, (comment_id, ))
        query_result = cursor.fetchall()
    return query_result