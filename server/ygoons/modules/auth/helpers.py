import os
import requests


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


