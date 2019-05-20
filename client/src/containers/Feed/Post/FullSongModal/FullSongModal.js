import React from 'react';
import { List, Icon } from 'semantic-ui-react';

import styles from './FullSongModal.module.css';

const FullSongModal = (props) => {
    let spotifyUrlItem, youtubeUrlItem, soundcloudUrlItem, bandcampUrlItem;
    if (props.urlObj['spotifyUrl']) {
        spotifyUrlItem = (
            <List.Item>
                <List.Content>
                    <a href={props.urlObj['spotifyUrl']}>
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
                    <a href={props.urlObj['youtubeUrl']}>
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
                    <a href={props.urlObj['soundcloudUrl']}>
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
                    BandCamp
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