import React, { Component } from 'react';
import { Grid, Image, Modal, Icon, Container, Input, Dropdown, Message } from 'semantic-ui-react';

import axios from '../../../shared/axios';
import { BASE_URL } from "../../../shared/config";
import styles from './Post.module.css';
import profileImg from '../../../resources/defaultProfileImage.jpg';
import FullSongModal from './FullSongModal/FullSongModal';
import ReportModal from './ReportModal/ReportModal';
import { convertDateToStr } from '../../../shared/dateUtils';

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
        startedPlaying: false,
        isPlayed: false,
        isPlaying: false,
        progressPercent: 0,
        fullSongModalOpen: false,
        profileImgSrc: null,
        dislikeClicked: false,
        reportModalOpen: false
    };

    audioRef = React.createRef();

    componentDidMount() {
        // get the list of ids of users who liked the post
        let url;
        if (this.state.likeCnt === null && this.state.isLiked === null) {
            url = "/post/" + this.props.postId + "/like";
            axios({method: 'GET', url: url})
                .then(response => {
                    this.setState({
                        likeCnt: response.data.users.length,
                        isLiked: response.data.users.includes(this.props.currUserId)
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if (this.state.commentCnt === null && this.state.commentPreviewArr === null) {
            url = "/post/" + this.props.postId + "/comment";
            axios({method: 'GET', url: url, params: {preview: true}})
                .then(response => {
                    this.setState({
                        commentCnt: response.data.commentCnt,
                        commentPreviewArr: response.data.commentPreviewArr
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if (!this.state.audioReady) {
            url = "/clip/" + this.props.postId;
            axios({method: 'GET', url: url})
                .then(response => {
                    this.setState({audioReady: true});
                })
                .catch(error => {
                    console.log(error);
                    console.log(error);
                });
        }
        if (!this.state.profileImgSrc) {
            url = "/user/" + this.props.userId + "/profile/image";
            axios({method: 'GET', url})
                .then(response => {
                    this.setState({profileImgSrc: BASE_URL + url + "?" + Date.now()});
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    commentInputHandler = (event) => {
        this.setState({
            commentInput: event.target.value
        });
    };

    songPlayHandler = () => {
        if (!this.state.isPlayed &&
            (this.props.isClipPlaying === null || this.props.isClipPlaying === this.props.postId)) {
            this.audioRef.current.play();
            if (!this.state.startedPlaying) {
                const url = "/user/history/played/" + this.props.postId;
                axios({method: 'POST', url: url})
                    .catch(error => {
                        console.log(error);
                    });
            }
            this.setState({isPlaying: true, startedPlaying: true});
            this.props.startPlayingClip(this.props.postId);
        }
    };

    songPauseHandler = () => {
        this.audioRef.current.pause();
        this.setState({isPlaying: false});
    };

    onAudioEnd = () => {
        const url = "/user/history/played_full/" + this.props.postId;
        axios({method: 'POST', url: url})
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


    likeClickHandler = () => {
        const url = "/post/" + this.props.postId + "/like";
        let httpMethod;
        if (this.state.isLiked) {
            httpMethod = 'DELETE';
        } else {
            httpMethod = 'POST'
        }
        axios({method: httpMethod, url: url})
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

    dislikeClickHandler = () => {
        const url = "/post/" + this.props.postId + "/dislike";
        axios({method: 'POST', url: url})
            .then(response => {
                if (response.data.success) {
                    this.setState({dislikeClicked: true});
                }
            })
            .catch(error => {
                console.log(error);
            })
    };

    commentClickHandler = () => {
        alert("show full post");
    };

    commentPostHandler = () => {
        const url = "/post/" + this.props.postId + "/comment";
        const requestData = {
            content: this.state.commentInput,
        };
        axios({method: 'POST', url: url, data: requestData})
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

    fullSongHandleOpen = () => {
        this.setState({fullSongModalOpen: true});
    };

    fullSongHandleClose = () => {
        this.setState({fullSongModalOpen: false});
    };

    reportHandleOpen = () => {
        this.setState({reportModalOpen: true});
    };

    reportHandleClose = () => {
        this.setState({reportModalOpen: false});
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
                commentPreviewDiv.reverse();
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
            audioDiv = <audio src={BASE_URL + "/clip/" + this.props.postId}
                              ref={this.audioRef} onTimeUpdate={this.initProgressBar}
                              onEnded={this.onAudioEnd}/>;
        }

        let dislikeMessage;
        if (this.state.dislikeClicked) {
            dislikeMessage = (
                <Message attached="bottom" negative size="small">
                    The song is added to Dislike list. View the list on "History" Tab in User Page.
                </Message>
            );
        }

        let playIcon;
        if (!this.state.isPlayed &&
            (this.props.isClipPlaying === null || this.props.isClipPlaying === this.props.postId)) { // can be played
            if (this.state.isPlaying) {
                playIcon = <Icon name="pause" size="big" onClick={this.songPauseHandler} className={styles.playIcon} />
            } else {
                playIcon = <Icon name="play" size="big" onClick={this.songPlayHandler} className={styles.playIcon} />
            }
        } else { // cannot be played
            playIcon = (
                <Icon name="play" size="big" color="grey"/>
            );
        }

        let fullSongModal = <Icon name="headphones" size="large" color="grey"/>;
        if (this.state.isPlayed) {
            fullSongModal = (
                <Modal trigger={<Icon name="headphones" size="large" onClick={this.fullSongHandleOpen}
                                      className={styles.actionIcon}/>}
                       size="tiny" open={this.state.fullSongModalOpen} onClose={this.fullSongHandleClose}>
                    <FullSongModal songName={this.props.songName} artist={this.props.artist}
                                   postId={this.props.postId} urlObj={this.props.urlObj}/>
                </Modal>
            );
        }

        let reportModal;
        if (this.state.audioReady) {
            reportModal = (
                <Modal open={this.state.reportModalOpen} onClose={this.reportHandleClose} size="tiny">
                    <ReportModal
                        postId={this.props.postId}
                        username={this.props.username}
                        reportModalClose={this.reportHandleClose}
                    />
                </Modal>
            );
        }

        return (
            <Container className={styles.postDiv}>
                <div className={styles.postHeaderDiv}>
                    <Grid>
                        <Grid.Column width={3} className={styles.profileImgColumn}>
                            <a href={"/" + this.props.username}>
                            <Image className={styles.profileImgDiv}
                                   src={this.state.profileImgSrc ? this.state.profileImgSrc : profileImg} />
                            </a>
                        </Grid.Column>
                        <Grid.Column width={13} className={styles.headerInfoColumn}>
                            <Grid.Row className={styles.usernameRow}>
                                <div className={styles.usernameDiv}>
                                    <div className={styles.usernameSpan}>
                                        <a href={"/" + this.props.username}>{this.props.username}</a>
                                    </div>
                                    <Dropdown icon="options" className={styles.dropdown}>
                                        <Dropdown.Menu>
                                            <Dropdown.Item text="Report" onClick={this.reportHandleOpen}/>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    { reportModal }
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
                                { playIcon }
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
                            <Grid.Column width={5}>
                                { fullSongModal }
                                <span className={styles.actionLabel}>Full Song</span>
                            </Grid.Column>
                            <Grid.Column width={5} textAlign="right">
                                <Icon
                                    name="warning circle" size="large" className={styles.actionIcon}
                                    onClick={this.dislikeClickHandler}
                                />
                                <span className={styles.actionLabel}>Not My Taste</span>
                            </Grid.Column>
                            <div className={styles.messageDiv}>
                                { dislikeMessage }
                            </div>
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