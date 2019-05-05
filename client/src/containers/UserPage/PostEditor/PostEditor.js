import React, { Component } from 'react';
import { Grid, Form, Input, TextArea, Button, Segment, Modal } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from 'react-redux';

import SongUploader from '../SongUploader/SongUploader';
import styles from './PostEditor.module.css';
import { postUpload } from '../../../store/actions/upload';

class PostEditor extends Component {
    state = {
        songSearch: '',
        content: '',
        tags: ''
    };

    contentInputHandler = (event) => {
        this.setState({
            content: event.target.value
        });
    };

    tagsInputHandler = (event) => {
        this.setState({
            tags: event.target.value
        });
    };

    songSearchInputHandler = (event) => {
        this.setState({
            songSearch: event.target.value
        });
    };

    // TODO: error handling (if the content is too long)
    sharePostHandler = () => {
        let url = "http://127.0.0.1:5000/post";
        const requestData = {
            content: this.state.content,
            tags: this.state.tags
        };
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        let newPostId;
        axios({method: 'POST', url: url, data: requestData, headers: requestHeaders})
            .then(response => {
                newPostId = response.data.postId;
                url = "http://127.0.0.1:5000/post/" + newPostId;
                return axios({method: 'GET', url: url, headers: requestHeaders});
            })
            .then(response => {
                this.setState({
                    postArr: [...this.state.postArr, response.data.posts[newPostId]]
                })
            })
            .catch(error => {
                console.log(error);
                alert(error);
            })
    };

    render() {
        const songUploadModal = (
            <Modal trigger={<Button>Browse</Button>} size="tiny">
                <div>Upload Your Song</div>
                <SongUploader/>
            </Modal>
        );

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
                                onChange={this.songSearchInputHandler}
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
                            { songUploadModal }
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
                                <Button fluid onClick={this.sharePostHandler}>Share</Button>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSharePost: (postContent, tags) => dispatch(postUpload(postContent, tags))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostEditor);