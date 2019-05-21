import React from 'react';
import { List, Icon } from 'semantic-ui-react';
import axios from 'axios';

import styles from './FullSongModal.module.css';

const onClickFullSong = (postId, serviceType) => {
    const url = "http://127.0.0.1:5000/user/history/full_song/" + postId;
    const headers = {
        'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
    };
    const data = {
        'serviceType': serviceType
    };
    axios({method: 'POST', url: url, headers: headers, data: data})
        .then(response => {

        })
        .catch(error => {
            console.log(error);
        })
};

const FullSongModal = (props) => {
    let spotifyUrlItem, youtubeUrlItem, soundcloudUrlItem, bandcampUrlItem;
    if (props.urlObj['spotifyUrl']) {
        spotifyUrlItem = (
            <List.Item>
                <List.Content>
                    <a href={props.urlObj['spotifyUrl']} style={{display: "table-cell"}} target="_blank"
                       onClick={() => onClickFullSong(props.postId, 'spotify')}>
                        <Icon name="spotify" size="big" color="green"/>
                        Spotify
                    </a>
                </List.Content>
            </List.Item>
        );
    }
    if (props.urlObj['youtubeUrl']) {
        youtubeUrlItem = (
            <List.Item>
                <List.Content>
                    <a href={props.urlObj['youtubeUrl']} style={{display: "table-cell"}} target="_blank"
                       onClick={() => onClickFullSong(props.postId,'youtube')}>
                        <Icon name="youtube" size="big" color="red"/>
                        Youtube
                    </a>
                </List.Content>
            </List.Item>
        );
    }
    if (props.urlObj['soundcloudUrl']) {
        soundcloudUrlItem = (
            <List.Item>
                <List.Content>
                    <a href={props.urlObj['soundcloudUrl']} style={{display: "table-cell"}} target="_blank"
                       onClick={() => onClickFullSong(props.postId, 'soundcloud')}>
                        <Icon name="soundcloud" size="big" color="orange"/>
                        SoundCloud
                    </a>
                </List.Content>
            </List.Item>
        );
    }
    if (props.urlObj['bandcampUrl']) {
        bandcampUrlItem = (
            <List.Item>
                <List.Content>
                    <a href={props.urlObj['bandcampUrl']} style={{display: "table-cell"}} target="_blank"
                       onClick={() => onClickFullSong(props.postId, 'bandcamp')}>
                        BandCamp
                    </a>
                </List.Content>
            </List.Item>
        );
    }
    return (
        <div className={styles.modalDiv}>
            <div className={styles.modalHeader}>
                <div>
                    { props.songName } <span className={styles.bySpan}>by</span> { props.artist }
                </div>
                <div className={styles.songLinkDiv}>
                    Listen to the Full Song Below
                </div>
            </div>
            <List horizontal relaxed='very' size="large">
                { spotifyUrlItem }
                { youtubeUrlItem }
                { soundcloudUrlItem }
                { bandcampUrlItem }
            </List>
        </div>
    );
};

export default FullSongModal;