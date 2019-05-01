import React, { Component } from 'react';
import { Grid, Image, Button, Label } from 'semantic-ui-react';

import styles from './UserPageHeader.module.css';
import backgroundImg from '../../../malibu_background.jpg'
import profileImg from '../../../yongkyun_profile_pic.jpg';
import axios from "axios/index";

class UserPageHeader extends Component {
    state = {
        isFollowed: null,
        followerArr: null,
        followingArr: null,
    };

    componentDidMount() {
        console.log("component did mount");
        if (this.props.userId) {
            if (this.state.isFollowed === null && this.state.followerArr === null) {
                this.getFollowers(this.props.userId);
            }
            if (this.state.followingArr === null) {
                this.getFollowing(this.props.userId);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("component will receive props");
        console.log(nextProps);
        if (nextProps.userId) {
            console.log(this.state);
            if (this.state.isFollowed === null && this.state.followerArr === null) {
                this.getFollowers(nextProps.userId);
            }
            if (this.state.followingArr === null) {
                this.getFollowing(nextProps.userId);
            }
        }
    }

    getFollowers = (userId) => {
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        const url = "http://127.0.0.1:5000/user/" + userId + "/followers";
        axios({method: 'GET', url: url, headers: headers})
            .then(response => {
                this.setState({
                    followerArr: response.data.followerArr,
                    isFollowed: response.data.followerArr.includes(this.props.authUserId)
                });
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
    };

    getFollowing = (userId) => {
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        const url = "http://127.0.0.1:5000/user/" + userId + "/following";
        axios({method: 'GET', url: url, headers: headers})
            .then(response => {
                this.setState({
                    followingArr: response.data.followingArr,
                });
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
    };

    followClickHandler = () => {
        let url = "http://127.0.0.1:5000/user/follow/" + this.props.userId;
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        let httpMethod;
        if (this.state.isFollowed) {
            httpMethod = 'DELETE';
        } else {
            httpMethod = 'POST';
        }
        axios({method: httpMethod, url: url, headers: headers})
            .then(response => {
                const newFollowerArr = [...this.state.followerArr];
                if (this.state.isFollowed) {
                    const index = newFollowerArr.indexOf(this.props.authUserId);
                    if (index !== -1) newFollowerArr.splice(index, 1);
                } else {
                    newFollowerArr.push(this.props.authUserId);
                }
                this.setState({
                    followerArr: newFollowerArr,
                    isFollowed: !this.state.isFollowed
                })
            })
            .catch(error => {
                alert(error);
            })
    };

    render () {
        let followButtonDiv = null;
        if (this.props.authUserId != this.props.userId) {
            followButtonDiv = (
                <div className={styles.followButtonDiv}>
                    <Button as='div' labelPosition='right' size='large' compact className={styles.followButton}>
                        <Button size='medium' compact color={this.state.isFollowed ? "grey" : "teal"}
                                onClick={this.followClickHandler}>
                                    <span className={styles.buttonSpan}>
                                        {this.state.isFollowed ? "following" : "follow"}
                                    </span>
                        </Button>
                        <Label size='medium' basic pointing='left'
                               color={this.state.isFollowed ? "grey" : "teal"}>
                            {this.state.followerArr ? this.state.followerArr.length : 0}
                        </Label>
                    </Button>
                </div>
            );
        }

        return (
            <Grid>
                <Grid.Row>
                    <div className={styles.usernameDiv}>{this.props.username}</div>
                    <img src={profileImg} className={styles.profileImg}/>
                    { followButtonDiv }
                    <Grid.Column width={16}>
                        <div className={styles.backgroundImgDiv}>
                            {/*<img className={styles.backgroundImg} src={backgroundImg}/>*/}
                            <Image fluid src={backgroundImg} className={styles.backgroundImg}/>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered className={styles.userPageMenuRow}>
                    <Grid.Column width={3} textAlign="center">
                        <div className={styles.userPageLeftmostMenuEntry}>"</div>
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="center" className={styles.userPageMenu}>
                        <div className={styles.userPageMenuEntry}>
                            {this.props.shareCnt} shares
                        </div>
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="center" className={styles.userPageMenu}>
                        <div className={styles.userPageMenuEntry}>3 playlists</div>
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="center" className={styles.userPageMenu}>
                        <div className={styles.userPageMenuEntry}>
                            {this.state.followerArr ? this.state.followerArr.length : 0} followers
                        </div>
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="center" className={styles.userPageMenu}>
                        <div className={styles.userPageMenuEntry}>
                            {this.state.followingArr ? this.state.followingArr.length : 0} following
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default UserPageHeader;