import React, { Component } from 'react';
import { Grid, Image, Header, Icon, Container, Input } from 'semantic-ui-react';

import styles from './Post.module.css';
import profileImg from '../../../default_profile_img.png';
import { convertDateToStr } from '../../../shared/utils';

class Post extends Component {
    state = {
        comment: ''
    };

    commentInputHandler = (event) => {
        this.setState({
            comment: event.target.value
        });
    };

    songPlayHandler = () => {
        alert("song played");
    };

    likeClickHandler = () => {
        // add like functionality
        alert("like clicked");
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
        alert("comment post");
    };

    render() {
        return (
            <Container className={styles.postDiv}>
                <div className={styles.postHeaderDiv}>
                    <Grid>
                        <Grid.Column width={3} className={styles.profileImgColumn}>
                            <Image className={styles.profileImgDiv} src={profileImg}/>
                        </Grid.Column>
                        <Grid.Column width={13} className={styles.headerInfoColumn}>
                            <Grid.Row>
                                <Header as='h2'>
                                    <a href={"/" + this.props.username}>
                                        <span className={styles.usernameSpan}>{this.props.username}</span>
                                    </a>
                                </Header>
                            </Grid.Row>
                            <Grid.Row className={styles.songInfoRow}>
                                <Grid.Column>
                                    <span>SongName</span> <span>by</span> <span>Artist</span>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                    <Grid padded>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <Icon name="play circle outline" size="big" className={styles.playIcon}
                                    onClick={this.songPlayHandler}
                                />
                            </Grid.Column>
                            <Grid.Column width={14} verticalAlign="middle" className={styles.playBarColumn}>
                                Play Bar
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
                                    name="heart outline" size="large" className={styles.actionIcon}
                                    onClick={this.likeClickHandler}
                                />
                                <span className={styles.actionLabel}>5 Like</span>
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
                                >3 comments</span>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className={styles.commentPreviewRow}>
                            <Grid.Column>
                                {/*  commentpreview component */}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className={styles.commentInputRow}>
                            <Grid.Column>
                                <Input
                                    fluid size="small"
                                    placeholder="Write a comment"
                                    value={this.state.comment}
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