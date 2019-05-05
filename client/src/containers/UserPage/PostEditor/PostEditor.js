import React, { Component } from 'react';
import { Grid, Form, Input, TextArea, Button, Segment, Modal } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from 'react-redux';

import SongUploader from '../SongUploader/SongUploader';
import styles from './PostEditor.module.css';
import { sharePost } from '../../../store/actions/upload';

class PostEditor extends Component {
    state = {
        content: '',
        tags: '',
        isSongUploaded: false,
        songUploadWarning: false
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.songFile && nextProps.songInfo.termsChecked) {
            this.setState({
                isSongUploaded: true,
                songUploadWarning: false
            });
        }
    }

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

    // TODO: error handling (if the content is too long)
    sharePostHandler = () => {
        if (this.state.isSongUploaded) {
            this.props.onSharePost(this.props.songFile, this.props.clipRange, this.props.songInfo,
                                   this.state.content, this.state.tags);
        } else {
            alert("Song not uploaded");
            this.setState({songUploadWarning: true});
        }
    };

    render() {
        const browseButton = (
            <div className={styles.browseButtonDiv}>
                <Button>Browse</Button>
            </div>
        );
        const songUploadModal = (
            <Modal trigger={browseButton} size="tiny">
                <SongUploader/>
            </Modal>
        );

        return (
            <Grid columns="2">
                <Grid.Column>
                    <div className={styles.uploadSongDiv}>
                        <div className={styles.browseHeaderDiv}>Upload Your Song (.mp3, .wav)</div>
                        { songUploadModal }
                    </div>
                </Grid.Column>
                <Grid.Column>
                    <Grid.Row>
                        <div className={styles.tagInputDiv}>
                            <input
                                placeholder="Write tags"
                                className={styles.uploadInput}
                                onChange={this.tagsInputHandler}
                                value={this.state.tags}
                            />
                        </div>
                    </Grid.Row>
                    <Grid.Row className={styles.songUploadRow}>
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
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        songFile: state.upload.songFile,
        clipRange: state.upload.clipRange,
        songInfo: state.upload.songInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSharePost: (songFile, clipRange, songInfo, postContent, tags) => dispatch(sharePost(songFile, clipRange, songInfo, postContent, tags))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostEditor);