import React, { Component } from 'react';
import { Grid, Input, Image } from 'semantic-ui-react';

import axios from '../../../../shared/axios';
import styles from './Comment.module.css';
import { convertDateToStr } from "../../../../shared/dateUtils";
import profileImg from '../../../../resources/defaultProfileImage.jpg';
import { BASE_URL, DEFAULT_REPLY_LOAD_NUM } from "../../../../shared/config";

class Comment extends Component {
    state = {
        replyInput: '',
        showReplies: false,
        replyCnt: 0,
        replyInputOn: false,
        profileImgSrc: null,
        replyArr: null
    };

    componentDidMount() {
        if (this.state.replyArr === null) {
            this.loadReplies();
        }
        if (!this.state.profileImgSrc) {
            const url = "/user/" + this.props.comment.userId + "/profile/image";
            axios({method: 'GET', url: url})
                .then(response => {
                    this.setState({profileImgSrc: BASE_URL + url + "?" + Date.now()});
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    loadReplies = () => {
        const url = "/comment/" + this.props.comment.commentId + "/reply";
        axios({method: 'GET', url: url})
            .then(response => {
                this.setState({
                    replyArr: response.data.replyArr,
                    replyCnt: response.data.replyArr.length < DEFAULT_REPLY_LOAD_NUM
                        ? response.data.replyArr.length : DEFAULT_REPLY_LOAD_NUM
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    showReplyClickHandler = () => {
        this.setState({showReplies: true});
    };

    replyInputHandler = (event) => {
        this.setState({replyInput: event.target.value});
    };

    replyClickHandler = () => {
        if (this.state.replyInputOn) {
            this.setState({replyInputOn: false});
        } else {
            this.setState({replyInputOn: true});
        }
    };

    showPrevClickHandler = () => {
        if (this.state.replyCnt + DEFAULT_REPLY_LOAD_NUM > this.state.replyArr.length) {
            this.setState({
                replyCnt: this.state.replyArr.length
            });
        } else {
            this.setState({
                replyCnt: this.state.replyCnt + DEFAULT_REPLY_LOAD_NUM
            });
        }
    };

    postReplyHandler = () => {
        const url = "/comment/" + this.props.comment.commentId + "/reply";
        const data = {
            content: this.state.replyInput
        };
        axios({method: 'POST', url: url, data: data})
            .then(response => {
                const newReply = {
                    replyId: response.data.replyId,
                    username: this.props.authUsername,
                    content: this.state.replyInput,
                    replyDate: convertDateToStr(Date.now())
                };
                this.setState({
                    replyInput: '',
                    replyArr: this.state.replyArr.concat([newReply]),
                    replyInputOn: false,
                    replyCnt: this.state.replyCnt + 1
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        let replyInput;
        if (this.state.replyInputOn) {
            replyInput = (
                <Input fluid size="mini"
                       placeholder="Write a reply"
                       value={this.state.replyInput}
                       onChange={this.replyInputHandler}
                       action={{
                           content: 'reply',
                           onClick: this.postReplyHandler
                       }}
                />
            );
        }

        let replyArrRow, showReplySpan, showPrevDiv;
        if (this.state.replyArr) {
            if (this.state.replyArr.length > 0) {
                if (this.state.showReplies) {
                    const start = this.state.replyArr.length - this.state.replyCnt;
                    const end = this.state.replyArr.length;
                    const replyArrDiv = this.state.replyArr.slice(start, end).map((reply, idx) => {
                        return (
                            <div key={idx} className={styles.replyDiv}>
                                <div className={styles.replyHeaderDiv}>
                                <span className={styles.usernameSpan}>
                                    { reply.username }
                                </span>
                                    <span className={styles.replyDateSpan}>
                                    { convertDateToStr(reply.replyDate) }
                                </span>
                                </div>
                                <div className={styles.contentDiv}>
                                    { reply.content }
                                </div>
                            </div>
                        )
                    });
                    replyArrRow = (
                        <div>
                            { replyArrDiv }
                        </div>
                    );
                    if (this.state.replyArr.length !== this.state.replyCnt) {
                        showPrevDiv = (
                            <div className={styles.replyOptionDiv}>
                            <span className={styles.showPrevSpan} onClick={this.showPrevClickHandler}>
                                Show Previous
                            </span>
                            </div>
                        );
                    }
                }
                showReplySpan = (
                    <span className={styles.replySpan} onClick={this.showReplyClickHandler}
                          style={this.state.showReplies ? {'color' : 'black'} : {'color': 'grey'}}>
                        Show Replies ({this.state.replyArr.length})
                    </span>
                );
            }
        }

        return (
            <div>
                <Grid.Row className={styles.commentRow}>
                    <div className={styles.containerDiv}>
                        <div className={styles.profileImgDiv}>
                            <Image className={styles.profileImg}
                                   src={this.state.profileImgSrc ? this.state.profileImgSrc : profileImg} />
                        </div>
                        <div className={styles.commentDiv}>
                            <div className={styles.commentContentDiv}>
                                <span className={styles.commentUsernameSpan}>
                                    <a href={"/" + this.props.comment.username}>{this.props.comment.username}</a>
                                </span>
                                <span className={styles.commentContentSpan}>{this.props.comment.commentContent}</span>
                            </div>
                            <div>
                                <span className={styles.dateSpan}>
                                    {convertDateToStr(this.props.comment.commentDate)}
                                </span>
                                { showReplySpan }
                                <span className={styles.writeReplySpan} onClick={this.replyClickHandler}
                                      style={this.state.replyInputOn ? {'color': 'black'} : {'color': 'grey'}}>
                                    Write Reply
                                </span>
                            </div>
                        </div>
                    </div>
                    { showPrevDiv }
                    <div className={styles.replyArrRowDiv}>
                        { replyArrRow }
                    </div>

                    <div className={styles.inputDiv}>
                        { replyInput }
                    </div>
                </Grid.Row>
            </div>
        )
    }
}

export default Comment;