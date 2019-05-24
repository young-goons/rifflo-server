import React, { Component } from 'react';
import { Grid, Image, Input, Icon } from 'semantic-ui-react';

import axios from '../../../shared/axios';
import styles from './Post.module.css';
import { convertDateToStr } from "../../../shared/dateUtils";
import profileImg from '../../../resources/defaultProfileImage.jpg';

class Post extends Component {
    state = {
        commentInput: '',
        commentCnt: null,
        commentArr: null,
        likeCnt: null,
        isLiked: null
    };

    componentDidMount() {
        if (this.state.commentCnt === null && this.state.commentArr === null) {
            this.loadComments();
        }
        if (this.state.likeCnt === null && this.state.isLiked === null) {
            this.loadLikes();
        }
    }

    loadComments = () => {
        const url = "/post/" + this.props.postId + "/comment";
        axios({method: 'GET', url: url, params: {preview: false}})
            .then(response => {
                console.log(response.data);
                this.setState({
                    commentCnt: response.data.commentCnt,
                    commentArr: response.data.commentPreviewArr
                })
            })
            .catch(error => {
                alert(error);
                console.log(error);
            })
    };

    loadLikes = () => {
        const url = "/post/" + this.props.postId + "/like";
        axios({method: 'GET', url: url})
            .then(response => {
                this.setState({
                    likeCnt: response.data.users.length,
                    isLiked: response.data.users.includes(this.props.currUserId)
                });
            })
            .catch(error => {
                alert(error);
            })
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
                alert("Song added to skip list. (Go to my page to edit the list of disliked songs");
            })
            .catch(error => {
                console.log(error);
            })
    };

    commentInputHandler = (event) => {
        this.setState({commentInput: event.target.value});
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
                    commentContent: this.state.commentInput,
                    commentDate: convertDateToStr(Date.now())
                };
                this.setState ({
                    commentInput: '',
                    commentCnt: this.state.commentCnt + 1,
                    commentArr: this.state.commentArr.concat([newComment])
                })
            })
            .catch(error => {
                alert(error);
            });
    };

    render() {
        let commentArrRow;
        if (this.state.commentArr) {
            if (this.state.commentArr.length > 0) {
                const commentArrDiv = this.state.commentArr.map((comment, idx) => {
                    return (
                        <Grid.Row key={idx} className={styles.commentRow}>
                            <div className={styles.commentDiv}>
                                <span className={styles.commentUsernameSpan}>
                                    <a href={"/" + comment.username}>{comment.username}</a>
                                </span>
                                <span className={styles.commentContentSpan}>{comment.commentContent}</span>
                            </div>
                            <div>
                                <span className={styles.dateSpan}>
                                    {convertDateToStr(comment.commentDate)}
                                </span>
                                <span className={styles.replySpan}>
                                    Reply
                                </span>
                            </div>
                        </Grid.Row>
                    )
                });
                commentArrRow = (
                    <Grid.Row className={styles.commentArrRow}>
                        <Grid.Column>
                            { commentArrDiv }
                        </Grid.Column>
                    </Grid.Row>
                );
            }
        }

        return (
            <div className={styles.postContainerDiv}>
                <Grid>
                    <Grid.Column width={3} className={styles.profileImgColumn}>
                        <Image src={profileImg} className={styles.profileImgDiv}/>
                    </Grid.Column>
                    <Grid.Column width={13} textAlign="left" className={styles.headerInfoColumn}>
                        <Grid.Row className={styles.usernameRow}>
                            <div className={styles.usernameSpan}>
                                <a href={"/" + this.props.username}>{this.props.username}</a>
                            </div>
                        </Grid.Row>
                        <Grid.Row className={styles.uploadDateRow}>
                            {convertDateToStr(this.props.uploadDate)}
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
                <Grid textAlign="left" padded>
                    <Grid.Row className={styles.songInfoRow}>
                        <Grid.Column>
                            <span>{this.props.songName}</span>
                            <span className={styles.bySpan}>by</span>
                            <span>{this.props.artist}</span>
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
                            <Icon
                                name="comments" size="large"
                            />
                            <span>
                                {this.state.commentCnt} {this.state.commentCnt <= 1 ? "Comment" : "Comments"}
                            </span>
                        </Grid.Column>
                        <Grid.Column width={5} textAlign="right">
                            <Icon
                                name="warning circle" size="large" className={styles.actionIcon}
                                onClick={this.dislikeClickHandler}
                            />
                            <span className={styles.actionLabel}>Not My Taste</span>
                        </Grid.Column>
                    </Grid.Row>
                    { commentArrRow }
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
                </Grid>
            </div>
        )
    }
}

export default Post;