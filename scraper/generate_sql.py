import pandas as pd
import json
import requests
import sys
from urllib.parse import quote

# Constants
SPOTIFY_CLIENT_ID_KEY = 'YTA2NmZjODUzMWY0NGMwODgxODQ5ZWNhMDM1MGY5N2I6NmM5YWYzYTJkYTk5NDU2ZWEyZDI1MmE1ZmMwZTczMDU'

def escape(s):
    return s.replace("'", "\\'").replace('"', '\\"')

def get_access_token():
    r = requests.post(url = 'https://accounts.spotify.com/api/token',
            data={'grant_type': 'client_credentials'},
            headers={'Authorization': f'Basic {SPOTIFY_CLIENT_ID_KEY}'})
    j = json.loads(r.text)
    try:
        return j['access_token']
    except:
        sys.stderr.write(f'get_access_token: {j}\n')
        return None

TOKEN = get_access_token()

def get_spotify_url(track, artist):
    qtrack = quote(track, safe='')
    qartist = quote(artist, safe='')
    query = f'track%3A{qtrack}%20artist%3A{qartist}&type=track&limit=1'

    r = requests.get(f'https://api.spotify.com/v1/search?q={query}',
                     headers={
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'Authorization': f'Bearer {TOKEN}'
                     })
    if r.status_code == 429:
        return 'RATE_LIMITED'
    j = json.loads(r.text)
    try:
        result_name = j['tracks']['items'][0]['name']
        result_artists = list(
            map(lambda x: x['name'], j['tracks']['items'][0]['artists']))
        # print(result_name, result_artists)
        return 'http://open.spotify.com/track/' + j['tracks']['items'][0]['id']
    except IndexError:
        sys.stderr.write('get_spotify_id: IndexError: no tracks returned\n')
        return ''
    except KeyError:
        sys.stderr.write('get_spotify_id: KeyError\n')
        sys.stderr.write(str(j))
        return 'KEY_ERROR'

data_dir = 'mbdump'

# path_artist = '/'.join([data_dir, 'artist'])
path_artist_credit = '/'.join([data_dir, 'artist_credit'])
# path_release = '/'.join([data_dir, 'release'])
path_recording = '/'.join([data_dir, 'recording'])

# df_artist = pd.read_csv(
#         path_artist,
#         sep='\t',
#         header=None,
#         usecols=[1,2],
#         names=['artist_id', 'artist'],
#         quoting=3 # csv.QUOTE_NONE = 3
#         )
df_artist_credit = pd.read_csv(
        path_artist_credit,
        sep='\t',
        header=None,
        usecols=[0,1],
        names=['artist_id', 'artist'],
        quoting=3 # csv.QUOTE_NONE = 3
        )
# df_release = pd.read_csv(
#         path_release,
#         sep='\t',
#         header=None,
#         usecols=[1,2],
#         names=['artist_id', 'song_name'],
#         quoting=3 # csv.QUOTE_NONE = 3
#         )
df_recording = pd.read_csv(
        path_recording,
        sep='\t',
        header=None,
        usecols=[2,3],
        names=['song_name', 'artist_id'],
        quoting=3 # csv.QUOTE_NONE = 3
        )

# df_songs = df_artist.join(
#         # df_release,
#         df_recording,
#         how='right',
#         lsuffix='_left',
#         rsuffix='_right'
#         )[['song_name', 'artist']].fillna('')
df_song = df_recording.merge(
        df_artist_credit,
        how='left',
        on='artist_id')[['song_name', 'artist']].dropna()

songs = df_song.values
insert_query = 'INSERT INTO tbl_song_info(song_name, artist, spotify_url) VALUES\n'
value_query = "('{}', '{}', '{}')"
window = 10000
import math
rate_limit_flag = False
for i in range(223, math.ceil(len(songs) / window)):
    if not rate_limit_flag:
        with open('sql/song_{}.sql'.format(i), 'w') as f:
            f.write(insert_query)
            begin = i * window
            end = (i + 1) * window - 1
            end = end if end < len(songs) else len(songs) - 1
            print('Saving insert queries for batch {} with pairs {} to {}...'.format(i, begin, end))
            count = 0
            tcount = 0
            for song_name, artist in songs[begin:(end - 1)]:
                url = get_spotify_url(song_name, artist)
                if url == 'KEY_ERROR':
                    TOKEN = get_access_token()
                    url = get_spotify_url(song_name, artist)
                if url == 'RATE_LIMITED':
                    rate_limit_flag = True
                    print('Rate Limited!')
                    break
                f.write(
                        value_query.format(
                            escape(song_name),
                            escape(artist),
                            url,
                            ) + ',\n'
                        )
                if url: count += 1
                tcount += 1
                print(tcount)
            if not rate_limit_flag:
                song_name, artist = songs[end]
                url = get_spotify_url(song_name, artist)
                if url == 'RATE_LIMITED':
                    rate_limit_flag = True
                    print('Rate Limited!')
                    break
                f.write(
                        value_query.format(
                            escape(song_name),
                            escape(artist),
                            url,
                            ) + ';\n'
                        )
                if url: count += 1
                tcount += 1
            print('hits / misses = %f' % (count / tcount))
# print('Saving insert queries for {} songs/artists...'.format(len(songs)))
# with open('song.sql', 'w') as f:
#     f.write(insert_query)
#     for song_name, artist in songs[:-1]:
#         f.write(
#                 value_query.format(
#                     escape(song_name),
#                     escape(artist)
#                     ) + ',\n'
#                 )
#     song_name, artist = songs[-1]
#     f.write(
#             value_query.format(
#                 escape(song_name),
#                 escape(artist)
#                 ) + ';\n'
#             )

