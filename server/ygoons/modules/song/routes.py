"""
TODO: Set up database, with music, compute metaphones for each song, use Levenshtein distance to order results

document source of music titles, implement similar function for author, etc.
"""

import json

import flask
from flask import request, jsonify, make_response

from ygoons.modules.song import blueprint, helpers
import fuzzywuzzy as fw

DEFAULT_NUM_RESULTS = 10


@blueprint.route('/song', methods=['GET'])
def get_search_results():
    """
    Fetches search results for a substring of a song.

    INPUT:
        key: search term
        numresults: number of results to display
    OUTPUT:
        List of size `numresults` of potential matches, ordered in their
        closeness to `key`. Each match is a tuple of (title, artist).

    TODO:
        helper function to select "substring%" song names
        order results with fuzzywuzzy and select first `numresults`
        eventually do metaphone matching (for misspellings)
        eventually sort by popularity as well
    """
    key = request.args.get('key', '')
    num_results = request.args.get('numresults', DEFAULT_NUM_RESULTS)

    # TODO: move to helper function
    results = []
    if len(key) > 3:
        similar_songs = get_similar_songs(key)
        songs = [s[1] for s in similar_songs]
        temp = fw.process(key, songs, limit=num_results)
        for t, score in temp:
            for s in similar_songs:
                if s[0] == t:
                    results.append(s)
                    if len(results) > num_results: break

    return make_response(jsonify({'results': results}), 200)
