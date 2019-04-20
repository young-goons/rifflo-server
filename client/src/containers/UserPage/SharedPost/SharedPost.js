import React, { Component } from 'react';
import { Grid, Icon } from 'semantic-ui-react';

import styles from './SharedPost.module.css';

class SharedPost extends Component {
    state = {
        clipPlayed: false
    };

    playClip = () => {
        this.setState({clipPlayed: true});
    };

    render () {
        let songInfo = null;
        if (this.state.clipPlayed) {
            songInfo = (
                <Grid.Row className={styles.songInfoLinkRow}>
                    <Grid.Column width={8} textAlign="right" className={styles.songInfoColumn} verticalAlign="middle">
                        <span className={styles.songSpan}>{this.props.songName}</span> by <span className={styles.songSpan}>{this.props.artist}</span>
                    </Grid.Column>
                    <Grid.Column width={2} textAlign="left">
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
                <Grid.Column width={8} className={styles.clipPlayColumn} textAlign="right">
                    <Icon name="play circle outline" size="big" className={styles.playIcon}
                        onClick={this.playClip}
                    />
                    <span className={styles.playBar}>temp temp temp temp temp temp temp temp tmp</span>
                </Grid.Column>
                <Grid.Column width={3} className={styles.postLikeCommentColumn}>
                    <div className={styles.postLikeDiv}>
                        <Icon name="heart outline" size="large"/>
                        <span className={styles.likeNumSpan}>23</span>
                    </div>
                    <div className={styles.postCommentDiv}>
                        <Icon name="comment outline" size="large"/>
                        <span className={styles.commentNumSpan}>3</span>
                    </div>
                </Grid.Column>
                <Grid.Column width={3} textAlign="left" className={styles.postListTagsColumn}>
                    <span>{this.props.tags}</span>
                </Grid.Column>
                <Grid.Column width={2} className={styles.postListFullPostColumn}>
                    Full Post
                </Grid.Column>
                </Grid.Row>
                {songInfo}
            </Grid>
        );
    }
}

export default SharedPost;