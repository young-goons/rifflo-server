import React, { Component } from 'react';
import { Grid, Form, Input, TextArea, Button, Segment } from 'semantic-ui-react';
import axios from 'axios';

import styles from './PostEditor.module.css';

class PostEditor extends Component {
    state = {
        songSearch: '',
    };

    songSearchHandler = (event) => {
        this.setState({
            songSearch: event.target.value
        })
    };

    render() {
        return (
            <Grid columns="2">
                <Grid.Row>
                    <Grid.Column verticalAlign="middle">
                        <div className={styles.shareClipDiv}>
                            <span>Share a clip</span>
                        </div>
                        <div className={styles.searchSongInputDiv}>
                            <input
                                placeholder="Search a song"
                                className={styles.uploadInput}
                                onChange={this.songSearchHandler}
                                value={this.props.songSearch}
                            />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div className={styles.tagInputDiv}>
                            <input
                                placeholder="Write tags"
                                className={styles.uploadInput}
                                onChange={this.props.tagsInputHandler}
                                value={this.props.tags}
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className={styles.songUploadRow}>
                    <Grid.Column width={8} stretched>
                        <div className={styles.uploadSongDiv}>
                            Upload a song
                        </div>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <div className={styles.postInputDiv}>
                            <textarea
                                placeholder="Write post"
                                className={styles.postTextArea}
                                onChange={this.props.contentInputHandler}
                                value={this.props.content}
                            />
                            <div className={styles.shareButtonDiv}>
                                <Button fluid onClick={this.props.sharePostHandler}>Share</Button>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default PostEditor