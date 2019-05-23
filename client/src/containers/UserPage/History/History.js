import React, { Component } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import axios from 'axios';

import styles from './History.module.css';
import HistoryRow from './HistoryRow';

class History extends Component {
    state = {
        activeItem: "Clips Played",
        playArr: null,
        listenArr: null,
        dislikeArr: null,

    };

    componentDidMount() {
        if (!this.state.dislikeArr) {
            this.loadDislikeHistory();
        }
        if (!this.state.listenArr) {
            this.loadListenHistory();
        }
        if (!this.state.playArr) {
            this.loadPlayHistory();
        }
    }

    loadPlayHistory = () => {
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        const url = "http://127.0.0.1:5000/user/" + this.props.userId + "/played";
        axios({method: 'GET', url: url, headers: headers})
            .then(response => {
                this.setState({playArr: response.data.playArr});
            })
            .catch(error => {
                console.log(error);
            });
    };

    loadListenHistory = () => {
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        const url = "http://127.0.0.1:5000/user/" + this.props.userId + "/listened";
        axios({method: 'GET', url: url, headers: headers})
            .then(response => {
                this.setState({listenArr: response.data.fullSongArr});
            })
            .catch(error => {
                console.log(error);
            });
    };

    loadDislikeHistory = () => {
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        const url = "http://127.0.0.1:5000/user/" + this.props.userId + "/disliked";
        axios({method: 'GET', url: url, headers: headers})
            .then(response => {
                console.log(response.data);
                this.setState({dislikeArr: response.data.dislikeArr});
            })
            .catch(error => {
                console.log(error)
            });
    };

    handleItemClick = (e, { name }) => {
        this.setState({activeItem: name});
    };

    render() {
        let contentDiv;
        if (this.state.activeItem === 'Clips Played') {
            if (this.state.playArr) {
                contentDiv = this.state.playArr.map((song, idx) => {
                    return (
                        <HistoryRow key={idx} song={song} removeButton={false}/>
                    );
                });
            }
        } else if (this.state.activeItem === 'Songs Listened') {
            if (this.state.listenArr) {
                contentDiv = this.state.listenArr.map((song, idx) => {
                    return (
                        <HistoryRow key={idx} song={song} removeButton={false} />
                    );
                })
            }
        } else if (this.state.activeItem === 'Disliked') {
            if (this.state.dislikeArr) {
                contentDiv = this.state.dislikeArr.map((song, idx) => {
                    return (
                        <HistoryRow key={idx} song={song} removeButton={true}/>
                    );
                });
            }
        }

        const dislikeMenuItem = <Menu.Item name="Disliked" active={this.state.activeItem === "Disliked"}
                                           icon="warning circle" onClick={this.handleItemClick} />;

        return (
            <div className={styles.menuDiv}>
                <Menu color="grey" widths={this.props.authUserId === this.props.userId ? 3 : 2} size="large" secondary>
                    <Menu.Item name="Clips Played" active={this.state.activeItem === "Clips Played"}
                               icon="play" onClick={this.handleItemClick} />

                    <Menu.Item name="Songs Listened" active={this.state.activeItem === "Songs Listened"}
                               icon="headphones" onClick={this.handleItemClick} />
                    { this.props.authUserId === this.props.userId ? dislikeMenuItem : null }
                </Menu>
                <div className={styles.contentDiv}>
                    <Grid>
                        { contentDiv }
                    </Grid>
                </div>
            </div>
        );
    }
}

export default History;