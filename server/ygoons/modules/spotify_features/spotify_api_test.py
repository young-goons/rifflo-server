import csv
import json
import requests
import sys
import numpy as np
import pickle
import itertools
from urllib.parse import quote


TOKEN = 'redacted'

def get_spotify_id(track, artist, album=None, year=None):
    """Attempt to find the Spotify ID of a song.

    Args:
        track (str): Name of track
        artist (str): Name of artist
        album (str): Name of album
        year (str): Year of release

    Returns:
        str: Spotify ID of the song, or empty string if no ID was found.
    """
    # URL encode the strings
    qtrack = quote(track, safe='')
    qartist = quote(artist, safe='')
    if album:
        qalbum = quote(album, safe='')
    if year:
        qyear = quote(year, safe='')
    query = f'track%3A{qtrack}%20artist%3A{qartist}'
    if album:
        query += f'%20album%3A{qalbum}'
    if year:
        query += f'%20year%3A{qyear}'
    # Query only for tracks, and only look at top search result
    query += '&type=track&limit=1'

    r = requests.get(
            f'https://api.spotify.com/v1/search?q={query}',
            headers=
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {TOKEN}'
            }
    )
    j = json.loads(r.text)
    try:
        result_name = j['tracks']['items'][0]['name']
        result_artists = list(map(lambda x: x['name'], j['tracks']['items'][0]['artists']))
        # print(result_name, result_artists)
        return j['tracks']['items'][0]['id']
    except IndexError:
        sys.stderr.write('get_spotify_id: IndexError: no tracks returned\n')
        return ''
    except KeyError:
        sys.stderr.write('get_spotify_id: KeyError\n')
        return ''

def get_audio_features(track_id):
    """Get audio features for a track.
    Args:
        track_id (str): Spotify ID for the track.

    Returns:
        dict: audio feature name -> value
    """

    r = requests.get(
            f'https://api.spotify.com/v1/audio-features/{track_id}',
            headers=
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {TOKEN}'
            }
    )
    j = json.loads(r.text)
    return j

def get_audio_feature_vec(audio_features):
    return np.array([
        audio_features['danceability'],
        audio_features['energy'],
        audio_features['loudness'],
        audio_features['acousticness'],
        audio_features['instrumentalness'],
        audio_features['liveness'],
        audio_features['valence']
    ])

# TESTING

def save_topsongs_features():
    l = []

    with open('TopSongs.csv', 'r') as f:
        artist_idx = 1
        release_idx = 2
        year_idx = 3
        r = csv.reader(f)
        for line in r:
            artist = line[artist_idx]
            track = line[release_idx]
            year = line[year_idx]
            l.append((artist, track, year))

    flist = []
    for (artist, track, year) in l:
        print(track)
        track_id = get_spotify_id(track, artist)
        if track_id != '':
            audio_features = get_audio_features(track_id)
            flist.append((artist, track, year, audio_features))
        # Only need like 500 songs
        if len(flist) == 500:
            break

    pickle.dump(flist, open('save_topsongs.p', 'wb'))

def topsongs_cosine():
    flist = pickle.load(open('save_topsongs.p', 'rb'))
    track_features = list(map(lambda x: ((x[1], x[0]), get_audio_feature_vec(x[3])), flist))

    similarity_list = []
    for ((s1, f1), (s2, f2)) in itertools.combinations(track_features, 2):
        sim = np.dot(f1, f2)/np.linalg.norm(f1)/np.linalg.norm(f2)
        similarity_list.append(((s1, s2), sim))

    similarity_list = sorted(similarity_list, key=lambda x: x[1], reverse=True)
    return similarity_list
# END TESTING

def get_audio_analysis(track_id):
    """Get audio analysis for a track.
    Args:
        track_id (str): Spotify ID for the track.

    Returns:
        TODO
    """

    r = requests.get(
            f'https://api.spotify.com/v1/audio-analysis/{track_id}',
            headers=
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {TOKEN}'
            }
    )
    j = json.loads(r.text)
    return j
