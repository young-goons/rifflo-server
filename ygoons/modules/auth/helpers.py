import os
import requests

import flask


def get_facebook_id(user_access_token):
    try:
        app_token_params = {
            'client_id': os.environ['FACEBOOK_API_KEY'],
            'client_secret': os.environ['FACEBOOK_SECRET_KEY'],
            'grant_type': 'client_credentials'
        }
        app_token_url = "https://graph.facebook.com/oauth/access_token"
        r = requests.get(url=app_token_url, params=app_token_params)
        app_access_token = r.json()['access_token']

        user_token_params = {
            'input_token': user_access_token,
            'access_token': app_access_token
        }
        user_token_url = "https://graph.facebook.com/debug_token"
        r = requests.get(url=user_token_url, params=user_token_params)
        data = r.json()['data']

        facebook_id = data['user_id']

    except:
        facebook_id = None

    return facebook_id


def init_auth_info(user_id, email):
    default_username = user_id.replace('-', '')
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        INSERT INTO tbl_user (user_id, email, username)
        VALUES (%s, %s, %s)
        '''
        tbl_user_row_cnt = cursor.execute(sql, (user_id, email, default_username))

        sql = '''
        INSERT INTO tbl_user_info (user_id)
        VALUES (%s)
        '''
        tbl_user_info_row_cnt = cursor.execute(sql, (user_id, ))

    if tbl_user_row_cnt == 1 and tbl_user_info_row_cnt == 1:
        flask.g.pymysql_db.commit()
        return default_username
    else:
        return None


def get_auth_info(user_id, email):
    with flask.g.pymysql_db.cursor() as cursor:
        sql = '''
        SELECT user_id, username, username_set, email, name, location
        FROM tbl_user NATURAL JOIN tbl_user_info
        WHERE user_id = %s AND email = %s
        '''
        cursor.execute(sql, (user_id, email))
        auth_result = cursor.fetchall()
    if len(auth_result) == 0:
        initial_username = init_auth_info(user_id, email)
        if initial_username is None:
            user = None
        else:
            user = {
                'userId': user_id,
                'username': initial_username,
                'usernameSet': False,
                'email': email,
                'userInfo': None
            }
    elif len(auth_result) == 1:
        user = {
            'userId': auth_result[0][0],
            'username': auth_result[0][1],
            'usernameSet': auth_result[0][2],
            'email': auth_result[0][3],
            'userInfo': {
                'name': auth_result[0][4],
                'location': auth_result[0][5]
            }
        }
    else:
        user = None

    return user
