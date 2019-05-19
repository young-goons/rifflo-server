import React, { Component } from 'react';
import {Grid, Icon} from "semantic-ui-react";
import {convertDateToStr} from "../../../shared/dateUtils";
import axios from 'axios';

import styles from "./History.module.css";

class HistoryRow extends Component {
    state = {
        removed: false
    };

    removeDislike = (postId) => {
        const url = 'http://127.0.0.1:5000/post/' + postId + '/dislike';
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        axios({method: 'DELETE', url: url, headers: headers})
            .then(response => {
                this.setState({removed: true});
            })
            .catch(error => {
                console.log(error);
            });
    };

    addDislike = (postId) => {
        const url = 'http://127.0.0.1:5000/post/' + postId + '/dislike';
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        axios({method: 'POST', url: url, headers: headers})
            .then(response => {
                this.setState({removed: false});
            })
            .catch(error => {
                console.log(error);
            });
    };

    render () {
        let removeButtonColumn;
        if (this.props.removeButton && !this.state.removed) {
            removeButtonColumn = (
                <Grid.Column width={1}>
                    <Icon name="x" onClick={() => this.removeDislike(this.props.song.postId)}
                          className={styles.removeDislikeIcon}/>
                </Grid.Column>
            );
        } else if (this.props.removeButton && this.state.removed) {
            removeButtonColumn = (
                <Grid.Column width={1}>
                    <Icon name="add" onClick={() => this.addDislike(this.props.song.postId)}
                          className={styles.removeDislikeIcon}/>
                </Grid.Column>
            );
        }
        return (
            <Grid.Row textAlign="left"
                      className={styles.historyRow}>
                <Grid.Column width={10}>
                    <span className={this.state.removed ? styles.removedSpan : styles.songNameSpan}>
                        { this.props.song.songName }
                    </span>
                    <span className={styles.bySpan}>by</span>
                    <span className={this.state.removed ? styles.removedSpan : styles.artistSpan}>
                        { this.props.song.artist }
                    </span>
                </Grid.Column>
                <Grid.Column width={4}>
                    <span className={this.state.removed ? styles.removedSpan : styles.dateSpan}>
                        { convertDateToStr(this.props.song.date) }
                    </span>
                </Grid.Column>
                <Grid.Column width={1}>
                    <Icon name="headphones" color={this.state.removed ? "grey" : "black"}/>
                </Grid.Column>
                { removeButtonColumn }
            </Grid.Row>
        );
    }
}

export default HistoryRow;