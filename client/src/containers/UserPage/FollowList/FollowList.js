import React, { Component } from 'react';
import { List, Grid, Button } from 'semantic-ui-react';
import axios from 'axios';

import { DEFAULT_FOLLOW_LOAD_NUM } from "../../../shared/config";
import FollowItem from "./FollowItem";
import styles from './FollowList.module.css';

const load_num = 3;

class FollowList extends Component {
    state = {
        followIdArr: null,
        followLoadCnt: 0, // index to obtain in the next step or the number of elements loaded currently
    };

    componentDidMount() {
        if (!this.state.followIdArr) {
            if (this.props.followType === 'followers') {
                this.loadFollowers();
            } else if (this.props.followType === 'following') {
                this.loadFollowing();
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.followType === 'followers') {
            this.loadFollowers();
        } else if (nextProps.followType === 'following') {
            this.loadFollowing();
        }
    }

    loadFollowers = () => {
        let loadCnt;
        const url = "http://127.0.0.1:5000/user/" + this.props.userId + "/followers";
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        axios({methods: 'GET', url: url, headers: headers})
            .then(response => {
                if (response.data.followerArr.length < load_num) {
                    loadCnt = response.data.followerArr.length;
                } else {
                    loadCnt = load_num;
                }
                this.setState({
                    followIdArr: response.data.followerArr,
                    followLoadCnt: loadCnt
                });
            })
            .catch(error => {
                console.log(error);
            })
    };

    loadFollowing = () => {
        let loadCnt;
        const url = "http://127.0.0.1:5000/user/" + this.props.userId + "/following";
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        axios({method: 'GET', url: url, headers: headers})
            .then(response => {
                if (response.data.followingArr.length < load_num) {
                    loadCnt = response.data.followingArr.length;
                } else {
                    loadCnt = load_num;
                }
                this.setState({
                    followIdArr: response.data.followingArr,
                    followLoadCnt: loadCnt
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    loadClickHandler = () => {
        console.log("clicked");
        if (this.followLoadCnt + load_num >= this.state.followIdArr.length) {
            this.setState({followLoadCnt: this.state.followIdArr.length})
        } else {
            this.setState({followLoadCnt: this.state.followLoadCnt + load_num});
        }
    };

    render() {
        let followArr;
        if (this.state.followIdArr) {
            followArr = this.state.followIdArr.slice(0, this.state.followLoadCnt).map((userId, idx) => {
                return (
                    <FollowItem
                        key={idx}
                        userId={userId}
                    />
                );
            });
        }

        return (
            <div>
                <Grid columns={3} className={styles.listDiv}>
                    <Grid.Column>
                        <List verticalAlign="middle">
                            { this.state.followIdArr ? followArr.filter((_, i) => i % 3 === 0) : null }
                        </List>
                    </Grid.Column>
                    <Grid.Column>
                        <List verticalAlign="middle">
                            { this.state.followIdArr ? followArr.filter((_, i) => i % 3 === 1) : null }
                        </List>
                    </Grid.Column>
                    <Grid.Column>
                        <List verticalAlign="middle">
                            { this.state.followIdArr ? followArr.filter((_, i) => i % 3 === 2) : null}
                        </List>
                    </Grid.Column>
                </Grid>
                <Button onClick={this.loadClickHandler}>Load</Button>
            </div>
        );
    }
}

export default FollowList;