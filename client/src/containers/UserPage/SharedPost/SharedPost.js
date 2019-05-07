import React, { Component } from 'react';
import { Grid, Icon } from 'semantic-ui-react';

import styles from './SharedPost.module.css';
import axios from "axios";

class SharedPost extends Component {
    state = {
        audioReady: false,
        isPlayed: false,
        isPlaying: false,
        progressPercent: 0
    };

    audioRef = React.createRef();

    componentDidMount() {
        if (!this.state.audioReady) {
            const url = "http://127.0.0.1:5000/clip/" + this.props.postId;
            const requestHeaders = {
                'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken'),
            };
            axios({method: 'GET', url: url, headers: requestHeaders})
                .then(response => {
                    this.setState({audioReady: true});
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
        }
    }

    songPlayHandler = () => {
        if (!this.state.isPlayed) {
            this.audioRef.current.play();
            this.setState({isPlaying: true});
        } else {
            alert("Clip has been already played");
        }
    };

    songPauseHandler = () => {
        this.audioRef.current.pause();
        this.setState({isPlaying: false});
    };

    onAudioEnd = () => {
        const url = "http://127.0.0.1:5000/user/history/played/" + this.props.postId;
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken'),
        };
        axios({method: 'POST', url: url, headers: requestHeaders})
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        this.setState({
            isPlaying: false,
            isPlayed: true,
            progressPercent: 1
        })
    };

    initProgressBar = () => {
        const player = this.audioRef.current;
        this.setState({
            progressPercent: player.currentTime / player.duration
        });
    };


    render () {
        let audioDiv = null;
        if (this.state.audioReady) {
            audioDiv = <audio src={"http://127.0.0.1:5000/clip/" + this.props.postId}
                              ref={this.audioRef} onTimeUpdate={this.initProgressBar}
                              onEnded={this.onAudioEnd}/>
        }
        let songInfo = null;
        if (this.state.isPlayed) {
            songInfo = (
                <Grid.Row className={styles.songInfoLinkRow}>
                    <Grid.Column width={8} textAlign="right" className={styles.songInfoColumn} verticalAlign="middle">
                        <span className={styles.songSpan}>{this.props.songName}</span> by <span className={styles.songSpan}>{this.props.artist}</span>
                    </Grid.Column>
                    <Grid.Column width={2} textAlign="left" className={styles.fullSongColumn}>
                        <Icon name="spotify" size="big"/>
                    </Grid.Column>
                    <Grid.Column width={2} textAlign="left">
                        <Icon name="itunes" size="big"/>
                    </Grid.Column>
                    <Grid.Column width={2} textAlign="left">
                        <Icon name="youtube" size="big"/>
                    </Grid.Column>
                    <Grid.Column width={2} textAlign="left">
                        <Icon name="soundcloud" size="big"/>
                    </Grid.Column>
                </Grid.Row>
            );
        }
        return (
            <Grid>
                <Grid.Row>
                    { audioDiv }
                    <Grid.Column width={2} verticalAlign="middle" textAlign="right" className={styles.clipPlayColumn}>
                        { this.state.isPlaying || this.state.isPlayed ?
                            <Icon name="pause circle outline" size="big" onClick={this.songPauseHandler}/> :
                            <Icon name="play circle outline" size="big" onClick={this.songPlayHandler}/>
                        }
                    </Grid.Column>
                    <Grid.Column width={6} verticalAlign="middle" className={styles.progressBarColumn}>
                        <div className={styles.progressDiv}>
                            <progress value={this.state.progressPercent} max="1" className={styles.progressBar}/>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={3} verticalAlign="middle" className={styles.postLikeCommentColumn}>
                        <div className={styles.postLikeDiv}>
                            <Icon name="heart outline" size="large"/>
                            <span className={styles.likeNumSpan}>23</span>
                        </div>
                        <div className={styles.postCommentDiv}>
                            <Icon name="comment outline" size="large"/>
                            <span className={styles.commentNumSpan}>3</span>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={3} verticalAlign="middle" textAlign="left" className={styles.postListTagsColumn}>
                        <span>{this.props.tags}</span>
                    </Grid.Column>
                    <Grid.Column width={2} verticalAlign="middle" className={styles.postListFullPostColumn}>
                        Full Post
                    </Grid.Column>
                </Grid.Row>
                {songInfo}
            </Grid>
        );
    }
}

export default SharedPost;