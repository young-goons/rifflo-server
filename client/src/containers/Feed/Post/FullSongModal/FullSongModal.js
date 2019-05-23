import React from 'react';
import { List, Icon } from 'semantic-ui-react';
import axios from 'axios';

import styles from './FullSongModal.module.css';

const onClickFullSong = (postId, serviceType, linkUrl) => {
    const newWindow = window.open();
    window.opener = null;
    newWindow.location = linkUrl;
    newWindow.target = "_blank";

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
    let spotifyUrlItem, applemusicUrlItem, youtubeUrlItem, soundcloudUrlItem, bandcampUrlItem, otherUrlItem;
    if (props.urlObj['spotifyUrl']) {
        spotifyUrlItem = (
            <List.Item>
                <List.Content>
                    <Icon name="spotify" size="big" color="green" className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'spotify', props.urlObj.spotifyUrl)}
                    />
                    <span className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'spotify', props.urlObj.spotifyUrl)}>
                        Spotify
                    </span>
                </List.Content>
            </List.Item>
        );
    }
    if (props.urlObj['applemusicUrl']) {
        applemusicUrlItem = (
            <List.Item>
                <List.Content>
                    <Icon name="itunes" size="big" color="white" className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'applemusic', props.urlObj.applemusicUrl)}
                    />
                    <span className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'applemusic', props.urlObj.applemusicUrl)}>
                        Apple Music
                    </span>
                </List.Content>
            </List.Item>
        );
    }
    if (props.urlObj['youtubeUrl']) {
        youtubeUrlItem = (
            <List.Item>
                <List.Content>
                    <Icon name="youtube" size="big" color="red" className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'youtube', props.urlObj.youtubeUrl)}
                    />
                    <span className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'youtube', props.urlObj.youtubeUrl)}>
                        Youtube
                    </span>
                </List.Content>
            </List.Item>
        );
    }
    if (props.urlObj['soundcloudUrl']) {
        soundcloudUrlItem = (
            <List.Item>
                <List.Content>
                    <Icon name="soundcloud" size="big" color="orange" className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'soundcloud', props.urlObj.soundcloudUrl)}
                    />
                    <span className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'soundcloud', props.urlObj.soundcloudUrl)}>
                        SoundCloud
                    </span>
                </List.Content>
            </List.Item>
        );
    }
    if (props.urlObj['bandcampUrl']) {
        bandcampUrlItem = (
            <List.Item>
                <List.Content>
                    <Icon name="linkify" size="big" color="black" className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'bandcamp', props.urlObj.bandcampUrl)}
                    />
                    <span className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'bandcamp', props.urlObj.bandcampUrl)}>
                        SoundCloud
                    </span>
                </List.Content>
            </List.Item>
        );
    }
    if (props.urlObj['otherUrl']) {
        otherUrlItem = (
            <List.Item>
                <List.Content>
                    <Icon name="linkify" size="big" color="black" className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'other', props.urlObj.otherUrl)}
                    />
                    <span className={styles.fullSongLink}
                          onClick={() => onClickFullSong(props.postId, 'other', props.urlObj.otherUrl)}>
                        SoundCloud
                    </span>
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
                { applemusicUrlItem }
                { youtubeUrlItem }
                { soundcloudUrlItem }
                { bandcampUrlItem }
                { otherUrlItem }
            </List>
        </div>
    );
};

export default FullSongModal;