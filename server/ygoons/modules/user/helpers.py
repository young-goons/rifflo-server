# Helper functions for user module

import flask


def get_user_data(user_id):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = 'SELECT user_id, username, email, profile_picture_path ' \
              'FROM tbl_user NATURAL JOIN' \
              '(SELECT * FROM tbl_user_info WHERE user_id = %s) tbl_user_info_id'
        cursor.execute(sql, (user_id, ))
        query_result = cursor.fetchall()

    if len(query_result) != 1:
        return None

    user = {
        'userId': query_result[0][0],
        'username': query_result[0][1],
        'email': query_result[0][2],
        'profile_picture_path': query_result[0][3]
    }

    return user


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
