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
        songUploadWarning: false,
        modalOpen: false
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.songFile && nextProps.songInfo.termsChecked) {
            this.setState({
                isSongUploaded: true,
                songUploadWarning: false,
                modalOpen: false
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

    handleOpen = () => {
        this.setState({modalOpen: true});
    };

    handleClose = () => {
        this.setState({modalOpen: false});
    };

    // TODO: error handling (if the content is too long)
    sharePostHandler = () => {
        if (this.state.isSongUploaded) {
            this.props.onSharePost(this.props.songFile, this.props.clipRange, this.props.songInfo,
                                   this.state.content, this.state.tags);
            this.setState({isSongUploaded: false, content: '', tags: ''});
        } else {
            alert("Song not uploaded");
            this.setState({songUploadWarning: true});
        }
    };

    render() {
        const browseButton = (
            <div className={styles.browseButtonDiv}>
                <Button onClick={this.handleOpen}>Browse</Button>
            </div>
        );
        const editButton = (
            <div className={styles.editUploadButtonDiv}>
                <Button onClick={this.handleOpen} size="mini">Edit Upload</Button>
            </div>
        );
        const songUploadModal = (
            <Modal trigger={ this.state.isSongUploaded ? editButton : browseButton } size="tiny"
                   open={this.state.modalOpen} onClose={this.handleClose}>
                <SongUploader />
            </Modal>
        );

        let songUploadDiv = (
            <div className={styles.uploadSongDiv}>
                <div className={styles.browseHeaderDiv}>Upload Your Song (.mp3, .wav)</div>
                { songUploadModal }
            </div>
        );
        if (this.state.isSongUploaded && this.props.songInfo) {
            const songInfoDiv = (
                <Grid>
                    <Grid.Row className={styles.songInfoFirstRow}>
                        <Grid.Column width="5" textAlign="left" className={styles.songInfoLabelColumn}>
                            Track
                        </Grid.Column>
                        <Grid.Column width="11" textAlign="left" className={styles.songInfoColumn}>
                            {this.props.songInfo.track}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={styles.songInfoRow}>
                        <Grid.Column width="5" textAlign="left" className={styles.songInfoLabelColumn}>
                            Artist
                        </Grid.Column>
                        <Grid.Column width="11" textAlign="left" className={styles.songInfoColumn}>
                            {this.props.songInfo.artist}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={styles.songInfoRow}>
                        <Grid.Column width="5" textAlign="left" className={styles.songInfoLabelColumn}>
                            Clip Start
                        </Grid.Column>
                        <Grid.Column width="11" textAlign="left" className={styles.songInfoColumn}>
                            {this.props.clipRange.startTime.toFixed(2)}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={styles.songInfoRow}>
                        <Grid.Column width="5" textAlign="left" className={styles.songInfoLabelColumn}>
                            Clip End
                        </Grid.Column>
                        <Grid.Column width="11" textAlign="left" className={styles.songInfoColumn}>
                            {this.props.clipRange.endTime.toFixed(2)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
            songUploadDiv = (
                <div className={styles.uploadSongDiv}>
                    { songInfoDiv }
                    { songUploadModal }
                </div>
            )
        }
        return (
            <Grid columns="2">
                <Grid.Column>
                    { songUploadDiv }
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
        songInfo: state.upload.songInfo,
        newPostId: state.upload.newPostId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSharePost: (songFile, clipRange, songInfo, postContent, tags) => dispatch(sharePost(songFile, clipRange, songInfo, postContent, tags))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostEditor);