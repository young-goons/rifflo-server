"""
TODO: Set up database, with music, compute metaphones for each song, use Levenshtein distance to order results

document source of music titles, implement similar function for author, etc.
"""

import json
import os

import flask
from flask import request, jsonify, make_response, abort
from flask import current_app as app
from werkzeug.utils import secure_filename

from ygoons.modules.song import blueprint, helpers
from ygoons.utils import aws_amplify_login_required

# import fuzzywuzzy as fw
from fuzzywuzzy import process

DEFAULT_NUM_RESULTS = 10


@blueprint.route('/song', methods=['POST'])
@aws_amplify_login_required
def get_song_post_url():
    user_id = request.user['user_id']
    filename = json.loads(request.data)['filename']
    try:
        res = app.config['S3'].generate_presigned_post(app.config['S3_BUCKET_SONG'],
                                                       os.path.join(user_id, secure_filename(filename)))
        return make_response(jsonify({'res': res}), 200)
    except:
        return abort(400)


@blueprint.route('/song/info', methods=['POST'])
@aws_amplify_login_required
def post_song_info():
    user_id = request.user['user_id']
    song_info = json.loads(request.data)['songInfo']
    song_path = json.loads(request.data)['songPath']
    # check if song info exists
    existing_song_info = helpers.get_song_info(song_info['track'], song_info['artist'])
    if existing_song_info is None:  # upload new song
        song_id = helpers.upload_song_info(song_info)
        helpers.record_song_info_history(song_id, user_id, song_info)
    else:  # update song info
        song_id = existing_song_info['song_id']
        del existing_song_info['song_id']
        new_song_info = {}  # newly added song info
        updated_song_info = {}  # updated song info
        print(song_info)
        print(existing_song_info)
        for item in song_info:
            if song_info[item] != '' and existing_song_info[item] == '':
                new_song_info[item] = song_info[item]
            elif existing_song_info[item] != '' and existing_song_info[item] != song_info[item]:
                updated_song_info[item] = song_info[item]

        print(updated_song_info)
        print(new_song_info)
        for item in song_info:
            if item in new_song_info:
                updated_song_info[item] = new_song_info[item]
            elif item not in updated_song_info:
                updated_song_info[item] = None
        helpers.record_song_info_history(song_id, user_id, updated_song_info)

        # update song info if there is new info added
        if len(new_song_info) > 0:
            for item in song_info:
                if item not in new_song_info:
                    new_song_info[item] = existing_song_info[item]
            helpers.update_song_info(song_id, new_song_info)

    # insert data into tbl_user_song
    success = helpers.upload_user_song(song_id, user_id, song_path)
    flask.g.pymysql_db.commit()

    if success:
        return make_response(jsonify({'success': True}), 200)
    else:
        return abort(400)


@blueprint.route('/song/info', methods=['GET'])
def get_search_results():
    """
    Fetches search results for a substring of a song.

    INPUT:
        title_key: search term for title
        artist_key: search term for artist
        numresults: number of results to display
    OUTPUT:
        List of size `numresults` of potential matches, ordered in their
        closeness to (title_key, artist_key). Each match is a tuple of (title, artist).

    TODO:
        helper function to select "substring%" song names
        order results with fuzzywuzzy and select first `numresults`
        eventually do metaphone matching (for misspellings)
        eventually sort by popularity as well
    """
    title_key = request.args.get('title', '')
    artist_key = request.args.get('artist', '')
    num_results = int(request.args.get('numResults', DEFAULT_NUM_RESULTS))

    # TODO: move to helper function
    results = []
    if len(title_key) > 3 or len(artist_key) > 3:
        similar_songs = helpers.get_similar_songs(title_key, artist_key)
        # Fuzzy match song names
        songs = [s[0] for s in similar_songs]
        song_scores = process.extract(title_key, songs, limit=num_results)
        for t, score in song_scores:
            rm_idx_list = []
            for idx, s in enumerate(similar_songs):
                if s[0] == t:
                    results.append({
                        'songId': s[0],
                        'title': s[1],
                        'artist': s[2],
                        'spotifyUrl': s[3],
                        'applemusicUrl': s[4],
                        'youtubeUrl': s[5],
                        'soundcloudUrl': s[6],
                        'bandcampUrl': s[7]
                    })
                    rm_idx_list.append(idx)
                    if len(results) > num_results:
                        break
            rm_idx_list.reverse()
            for idx in rm_idx_list:
                similar_songs.pop(idx)

    return make_response(jsonify({'results': results}), 200)
