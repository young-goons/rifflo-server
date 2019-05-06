import React, { Component } from 'react';
import { Grid, Image, Button, Icon, Container, Input, Label, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

import styles from './Post.module.css';
import profileImg from '../../../default_profile_img.png';
import { convertDateToStr } from '../../../shared/dateUtils';
import {getCurrentTimeStr} from "../../../shared/musicUtils";

class Post extends Component {
    state = {
        commentInput: '',
        isLiked: null,
        likeCnt: null,
        commentCnt: null,
        isFollowed: null,
        followerCnt: null,
        commentPreviewArr: null,
        audioReady: false,
        isPlayed: false,
        isPlaying: false,
        progressPercent: 0
    };

    audioRef = React.createRef();

    componentDidMount() {
        // get the list of ids of users who liked the post
        let url;
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        if (this.state.likeCnt === null && this.state.isLiked === null) {
            url = "http://127.0.0.1:5000/post/" + this.props.postId + "/like";
            axios({method: 'GET', url: url, headers: headers})
                .then(response => {
                    this.setState({
                        likeCnt: response.data.users.length,
                        isLiked: response.data.users.includes(this.props.currUserId)
                    });
                })
                .catch(error => {
                    alert(error);
                })
        }
        if (this.state.commentCnt === null && this.state.commentPreviewArr === null) {
            url = "http://127.0.0.1:5000/post/" + this.props.postId + "/comment";
            axios({url: url, headers: headers})
                .then(response => {
                    this.setState({
                        commentCnt: response.data.commentCnt,
                        commentPreviewArr: response.data.commentPreviewArr
                    });
                })
                .catch(error => {
                    alert(error);
                })
        }
        if (!this.state.audioSrc) {
            url = "http://127.0.0.1:5000/clip/" + this.props.postId;
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

    commentInputHandler = (event) => {
        this.setState({
            commentInput: event.target.value
        });
    };

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



    likeClickHandler = () => {
        // add like functionality
        const url = "http://127.0.0.1:5000/post/" + this.props.postId + "/like";
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        let httpMethod;
        if (this.state.isLiked) {
            httpMethod = 'DELETE';
        } else {
            httpMethod = 'POST'
        }
        axios({method: httpMethod, url: url, headers: headers})
            .then(response => {
                this.setState({
                    likeCnt: this.state.isLiked ? this.state.likeCnt - 1 : this.state.likeCnt + 1,
                    isLiked: !this.state.isLiked,
                });
            })
            .catch(error => {
                alert(error);
            });
    };

    bookmarkClickHandler = () => {
        // add bookmark functionality
        alert("bookmark clicked")
    };

    fullSongClickHandler = () => {
        // use modal to show options
        alert("full song clicked");
    };

    commentClickHandler = () => {
        alert("show full post");
    };

    commentPostHandler = () => {
        const url = "http://127.0.0.1:5000/post/" + this.props.postId + "/comment";
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        const requestData = {
            content: this.state.commentInput,
        };
        axios({method: 'POST', url: url, headers: headers, data: requestData})
            .then(response => {
                const newComment = {
                    commentId: response.data.commentId,
                    userId: this.props.currUserId,
                    username: this.props.currUsername,
                    commentContent: this.state.commentInput
                };
                this.setState ({
                    commentInput: '',
                    commentCnt: this.state.commentCnt + 1,
                    commentPreviewArr: this.state.commentPreviewArr.concat([newComment])
                })
            })
            .catch(error => {
                alert(error);
            });
    };

    render() {
        let commentPreviewRow = null;
        if (this.state.commentPreviewArr) {
            if (this.state.commentPreviewArr.length > 0) {
                const commentPreviewDiv = this.state.commentPreviewArr.map((comment, idx) => {
                    return (
                        <Grid.Row key={idx}>
                            <span className={styles.commentUsernameSpan}>
                                <a href={"/" + comment.username}>{comment.username}</a>
                            </span>
                            <span className={styles.commentContentSpan}>{comment.commentContent}</span>
                        </Grid.Row>
                    )
                });
                commentPreviewRow = (
                    <Grid.Row className={styles.commentPreviewRow}>
                        <Grid.Column>
                            { commentPreviewDiv }
                        </Grid.Column>
                    </Grid.Row>
                );
            }
        }

        let songInfoSpan = null;
        if (this.state.isPlayed) {
            songInfoSpan = (
                <Grid.Column>
                    <span>{this.props.songName}</span>
                    <span className={styles.bySpan}>by</span>
                    <span>{this.props.artist}</span>
                </Grid.Column>
            );
        }

        let audioDiv = null;
        if (this.state.audioReady) {
            audioDiv = <audio src={"http://127.0.0.1:5000/clip/" + this.props.postId}
                              ref={this.audioRef} onTimeUpdate={this.initProgressBar}
                              onEnded={this.onAudioEnd}/>;
        }

        return (
            <Container className={styles.postDiv}>
                <div className={styles.postHeaderDiv}>
                    <Grid>
                        <Grid.Column width={3} className={styles.profileImgColumn}>
                            <Image className={styles.profileImgDiv} src={profileImg}/>
                        </Grid.Column>
                        <Grid.Column width={13} className={styles.headerInfoColumn}>
                            <Grid.Row className={styles.usernameRow}>
                                <div className={styles.usernameDiv}>
                                    <div className={styles.usernameSpan}>
                                        <a href={"/" + this.props.username}>{this.props.username}</a>
                                    </div>
                                    <Dropdown icon="options" className={styles.dropdown}>
                                        <Dropdown.Menu>
                                            <Dropdown.Item text="Report"/>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Grid.Row>
                            <Grid.Row className={styles.songInfoRow}>
                                { songInfoSpan }
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                    <Grid padded>
                        <Grid.Row className={styles.songPlayRow}>
                            { audioDiv }
                            <Grid.Column width={2}>
                                { this.state.isPlaying || this.state.isPlayed ?
                                    <Icon name="pause" size="big" onClick={this.songPauseHandler}/> :
                                    <Icon name="play" size="big" onClick={this.songPlayHandler}/>
                                }
                            </Grid.Column>
                            <Grid.Column width={14} verticalAlign="middle" className={styles.playBarColumn}>
                                <div className={styles.progressDiv}>
                                    <progress value={this.state.progressPercent} max="1" className={styles.progressBar}/>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className={styles.tagsRow}>
                            <Grid.Column>
                                <span className={styles.tagsSpan}>{this.props.tags}</span>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className={styles.contentRow}>
                            <Grid.Column>
                                <span className={styles.contentSpan}>{this.props.content}</span>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className={styles.actionRow}>
                            <Grid.Column width={6}>
                                <Icon
                                    name={this.state.isLiked ? "heart" : "heart outline"} size="large" className={styles.actionIcon}
                                    onClick={this.likeClickHandler}
                                />
                                <span className={styles.actionLabel}>
                                    {this.state.likeCnt} {this.state.likeCnt <= 1 ? "Like" : "Likes"}
                                </span>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Icon
                                    name="bookmark outline" size="large" className={styles.actionIcon}
                                    onClick={this.bookmarkClickHandler}
                                />
                                <span className={styles.actionLabel}>Bookmark</span>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Icon
                                    name="headphones" size="large" className={styles.actionIcon}
                                    onClick={this.fullSongClickHandler}
                                />
                                <span className={styles.actionLabel}>Full Song</span>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className={styles.commentHeaderRow}>
                            <Grid.Column>
                                <Icon
                                    name="comment outline" size="large" className={styles.actionIcon}
                                    onClick={this.commentClickHandler}
                                />
                                <span className={styles.actionLabel}
                                    onClick={this.commentClickHandler}
                                >{this.state.commentCnt} {this.state.commentCnt <= 1 ? "comment" : "comments"}</span>
                            </Grid.Column>
                        </Grid.Row>
                        { commentPreviewRow }
                        <Grid.Row className={styles.commentInputRow}>
                            <Grid.Column>
                                <Input
                                    fluid size="small"
                                    placeholder="Write a comment"
                                    value={this.state.commentInput}
                                    onChange={this.commentInputHandler}
                                    action={{
                                        content: 'post',
                                        onClick: this.commentPostHandler
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className={styles.dateRow}>
                            <Grid.Column>
                                <span className={styles.dateSpan}>{convertDateToStr(this.props.date)}</span>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Container>
        )
    };
}

export default Post;