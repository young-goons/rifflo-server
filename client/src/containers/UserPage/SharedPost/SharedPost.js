import React, { Component } from 'react';
import { Grid, Icon } from 'semantic-ui-react';

import styles from './SharedPost.module.css';
import axios from '../../../shared/axios';
import { BASE_URL } from "../../../shared/config";

class SharedPost extends Component {
    state = {
        audioReady: false,
        isPlayed: false,
        isPlaying: false,
        progressPercent: 0,
        likeCnt: null,
        commentCnt: null
    };

    audioRef = React.createRef();

    componentDidMount() {
        if (!this.state.audioReady) {
            const url = "/clip/" + this.props.postId;
            axios({method: 'GET', url: url})
                .then(response => {
                    this.setState({audioReady: true});
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
        }
        if (!this.state.likeCnt) {
            const url = '/post/' + this.props.postId + '/like';
            axios({method: 'GET', url: url})
                .then(response => {
                    this.setState({
                        likeCnt: response.data.users.length
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if (!this.state.commentCnt) {
            const url = "/post/" + this.props.postId + "/comment";
            axios({method: 'GET', url: url, params: {preview: true}})
                .then(response => {
                    this.setState({
                        commentCnt: response.data.commentCnt
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    songPlayHandler = () => {
        if (!this.state.isPlayed &&
            (this.props.isClipPlaying === null || this.props.isClipPlaying === this.props.postId)) {
            this.audioRef.current.play();
            this.setState({isPlaying: true});
            this.props.startPlayingClip(this.props.postId);
        }
    };

    songPauseHandler = () => {
        this.audioRef.current.pause();
        this.setState({isPlaying: false});
    };

    onAudioEnd = () => {
        const url = "/history/played/" + this.props.postId;
        axios({method: 'POST', url: url})
            .then(response => {

            })
            .catch(error => {
                console.log(error);
            });
        this.setState({
            isPlaying: false,
            isPlayed: true,
            progressPercent: 1
        });
        this.props.endPlayingClip();
    };

    initProgressBar = () => {
        const player = this.audioRef.current;
        this.setState({
            progressPercent: player.currentTime / player.duration
        });
    };

    clickLinkHandler = (serviceType) => {
        const newWindow = window.open();
        newWindow.opener = null;
        if (serviceType === "spotify") {
            newWindow.location = this.props.urlObj.spotifyUrl;
        } else if (serviceType === "applemusic") {
            newWindow.location = this.props.urlObj.applemusicUrl;
        } else if (serviceType === "youtube") {
            newWindow.location = this.props.urlObj.youtubeUrl;
        } else if (serviceType === "soundcloud") {
            newWindow.location = this.props.urlObj.soundcloudUrl;
        } else if (serviceType === "bandcamp") {
            newWindow.location = this.props.urlObj.bandcampUrl;
        } else if (serviceType === "other") {
            newWindow.location = this.props.urlObj.otherUrl;
        }
        newWindow.target = "_blank";

        const url = "/user/history/full_song/" + this.props.postId;
        const data = {
            'serviceType': serviceType
        };
        axios({method: 'POST', url: url, data: data})
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    };


    render () {
        let audioDiv = null;
        if (this.state.audioReady) {
            audioDiv = <audio src={BASE_URL + "/clip/" + this.props.postId}
                              ref={this.audioRef} onTimeUpdate={this.initProgressBar}
                              onEnded={this.onAudioEnd}/>
        }

        let playIcon;
        if (!this.state.isPlayed &&
            (this.props.isClipPlaying === null || this.props.isClipPlaying === this.props.postId)) { // can be played
            if (this.state.isPlaying) {
                playIcon = <Icon name="pause circle outline" size="big" onClick={this.songPauseHandler} className={styles.playIcon}/>
            } else {
                playIcon = <Icon name="play circle outline" size="big" onClick={this.songPlayHandler} className={styles.playIcon} />
            }
        } else {
            playIcon = <Icon name="play circle outline" size="big" color="grey" />
        }

        let songInfo = null;
        if (this.state.isPlayed) {
            let spotifyColumn, applemusicColumn, youtubeColumn, soundcloudColumn, bandcampColumn, otherColumn;
            let urlCnt = 0;
            if (this.props.urlObj.spotifyUrl) {
                spotifyColumn = (
                    <Grid.Column width={2} textAlign="right" className={styles.fullSongColumn}>
                        <Icon name="spotify" size="big" color="green" className={styles.fullSongLink}
                              onClick={() => this.clickLinkHandler("spotify")}
                        />
                    </Grid.Column>
                );
                urlCnt++;
            }
            if (this.props.urlObj.applemusicUrl) {
                applemusicColumn = (
                    <Grid.Column width={2} textAlign="right" className={styles.fullSongColumn}>
                        <Icon name="itunes" size="big" color="white" className={styles.fullSongLink}
                              onClick={() => this.clickLinkHandler("applemusic")}/>
                    </Grid.Column>
                );
                urlCnt++;
            }
            if (this.props.urlObj.youtubeUrl) {
                youtubeColumn = (
                    <Grid.Column width={2} textAlign="right" className={styles.fullSongColumn}>
                        <Icon name="youtube" size="big" color="red" className={styles.fullSongLink}
                              onClick={() => this.clickLinkHandler("youtube")}
                        />
                    </Grid.Column>
                );
                urlCnt++;
            }
            if (this.props.urlObj.soundcloudUrl) {
                soundcloudColumn = (
                    <Grid.Column width={2} textAlign="right" className={styles.fullSongColumn}>
                        <Icon name="soundcloud" size="big" color="orange" className={styles.fullSongLink}
                              onClick={() => this.clickLinkHandler("soundcloud")}
                        />
                    </Grid.Column>
                );
                urlCnt++;
            }
            if (this.props.urlObj.bandcampUrl) {
                bandcampColumn = (
                    <Grid.Column width={2} textAlign="right" className={styles.fullSongColumn}>
                        <Icon name="linkify" size="big" color="black" className={styles.fullSongLink}
                              onClick={() => this.clickLinkHandler("bandcamp")}
                        />
                    </Grid.Column>
                );
                urlCnt++;
            }
            if (this.props.urlObj.otherUrl) {
                otherColumn = (
                    <Grid.Column width={2} textAlign="right" className={styles.fullSongColumn}>
                        <Icon name="linkify" size="big" color="black" className={styles.fullSongLink}
                              onClick={() => this.clickLinkHandler("other")}
                        />
                    </Grid.Column>
                );
                urlCnt++;
            }

            songInfo = (
                <Grid.Row className={styles.songInfoLinkRow}>
                    <Grid.Column width={16 - 2 * urlCnt} textAlign="left" className={styles.songInfoColumn} verticalAlign="middle">
                        <span className={styles.songSpan}>{this.props.songName}</span> by <span className={styles.songSpan}>{this.props.artist}</span>
                    </Grid.Column>
                    { spotifyColumn }
                    { applemusicColumn }
                    { youtubeColumn }
                    { soundcloudColumn }
                    { bandcampColumn }
                    { otherColumn }
                </Grid.Row>
            );
        }

        return (
            <Grid>
                <Grid.Row>
                    { audioDiv }
                    <Grid.Column width={2} verticalAlign="middle" textAlign="right" className={styles.clipPlayColumn}>
                        { playIcon }
                    </Grid.Column>
                    <Grid.Column width={5} verticalAlign="middle" className={styles.progressBarColumn}>
                        <div className={styles.progressDiv}>
                            <progress value={this.state.progressPercent} max="1" className={styles.progressBar}/>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={3} verticalAlign="middle" textAlign="left"
                                 className={styles.postLikeCommentColumn}>
                        <div className={styles.postLikeDiv}>
                            <a href={"/post/" + this.props.postId}>
                                <span className={styles.likeNumSpan}>
                                    {this.state.likeCnt} {this.state.likeCnt <= 1 ? "Like" : "Likes"}
                                </span>
                            </a>
                        </div>
                        <div className={styles.postCommentDiv}>
                            <a href={"/post/" + this.props.postId}>
                                <span className={styles.commentNumSpan}>
                                    {this.state.commentCnt} {this.state.commentCnt <= 1 ? "Comment" : "Comments"}
                                </span>
                            </a>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={5} verticalAlign="middle" textAlign="left" className={styles.postListTagsColumn}>
                        <div className={styles.tagsDiv}>
                            <span>{this.props.tags}</span>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={2} verticalAlign="middle" className={styles.postListFullPostColumn}>
                        <div className={styles.fullPostDiv}>
                            <a href={"/post/" + this.props.postId}>
                                <span className={styles.fullPostSpan}>Full Post</span>
                            </a>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                {songInfo}
            </Grid>
        );
    }
}

export default SharedPost;