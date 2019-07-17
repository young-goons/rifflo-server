import csv
import json
import requests
import sys
from urllib.parse import quote
from ygoons.config import SPOTIFY_CLIENT_ID_KEY


def get_access_token():
    r = requests.post(
        url='https://accounts.spotify.com/api/token',
        data={'grant_type': 'client_credentials'},
        headers={'Authorization': f'Basic {SPOTIFY_CLIENT_ID_KEY}'})
    j = json.loads(r.text)
    try:
        return j['access_token']
    except:
        sys.stderr.write(f'get_access_token: {j}\n')
        return None


def get_spotify_id(track, artist, album=None, year=None, token=None):
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

    r = requests.get(f'https://api.spotify.com/v1/search?q={query}',
                     headers={
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': f'Bearer {token}'
                     })
    j = json.loads(r.text)
    try:
        result_name = j['tracks']['items'][0]['name']
        result_artists = list(
            map(lambda x: x['name'], j['tracks']['items'][0]['artists']))
        return j['tracks']['items'][0]['id']
    except IndexError:
        sys.stderr.write('get_spotify_id: IndexError: no tracks returned\n')
        return ''
    except KeyError:
        sys.stderr.write(f'get_spotify_id: {j}\n')
        return ''


def get_audio_features(track_id, token=None):
    """Get audio features for a track.
    Args:
        track_id (str): Spotify ID for the track.

    Returns:
        tuple (float): selected audio features
    """

    r = requests.get(f'https://api.spotify.com/v1/audio-features/{track_id}',
                     headers={
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': f'Bearer {token}'
                     })
    j = json.loads(r.text)

    return (
        j['danceability'],
        j['energy'],
        j['loudness'],
        j['acousticness'],
        j['instrumentalness'],
        j['liveness'],
        j['valence'],
    )
