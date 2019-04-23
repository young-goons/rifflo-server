import React, { Component } from 'react';
import { Grid, Form, Input, TextArea, Button, Segment } from 'semantic-ui-react';
import axios from 'axios';

import styles from './PostEditor.module.css';

class PostEditor extends Component {
    state = {
        songSearch: '',
        content: '',
        tags: ''
    };

    songSearchHandler = (event) => {
        this.setState({
            songSearch: event.target.value
        })
    };

    contentInputHandler = (event) => {
        this.setState({
            content: event.target.value
        });
    };

    tagsInputHandler = (event) => {
        this.setState({
            tags: event.target.value
        })
    };

    // TODO: error handling (if the content is too long)
    sharePostHandler = () => {
        const url = "http://127.0.0.1:5000/user/upload/post";
        const requestData = {
            content: this.state.content,
            tags: this.state.tags
        };
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        axios({method: 'POST', url: url, data: requestData, headers: requestHeaders})
            .then(response => {
                console.log(response);
                alert("Shared successfully");
            })
            .catch(error => {
                alert(error);
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
                                value={this.state.songSearch}
                            />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div className={styles.tagInputDiv}>
                            <input
                                placeholder="Write tags"
                                className={styles.uploadInput}
                                onChange={this.tagsInputHandler}
                                value={this.state.tags}
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
                                onChange={this.contentInputHandler}
                                value={this.state.content}
                            />
                            <div className={styles.shareButtonDiv}>
                                <Button fluid>Share</Button>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default PostEditor