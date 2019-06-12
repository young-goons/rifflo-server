"""
TODO: Set up database, with music, compute metaphones for each song, use Levenshtein distance to order results

document source of music titles, implement similar function for author, etc.
"""

import json

import flask
from flask import request, jsonify, make_response

from ygoons.modules.song import blueprint, helpers
# import fuzzywuzzy as fw
from fuzzywuzzy import process

DEFAULT_NUM_RESULTS = 10


@blueprint.route('/song', methods=['GET'])
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
