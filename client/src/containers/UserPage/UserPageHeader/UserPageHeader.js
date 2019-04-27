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
        let url;
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        if (this.state.isFollowed === null && this.state.followerArr === null && this.props.userId) {
            url = "http://127.0.0.1:5000/user/" + this.props.userId + "/followers";
            axios({method: 'GET', url: url, headers: headers})
                .then(response => {
                    this.setState({
                        followerArr: response.data.followerArr,
                        followingCnt: response.data.followerArr.length,
                        isFollowed: response.data.followerArr.includes(this.props.userId)
                    });
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
        }
        if (this.state.followingArr === null && this.props.userId) {
            url = "http://127.0.0.1:5000/user/" + this.props.userId + "/following";
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
        }
    }

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
                    const index = newFollowerArr.indexOf(this.props.userId);
                    if (index !== -1) newFollowerArr.splice(index, 1);
                } else {
                    newFollowerArr.push(this.props.userId);
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
        if (!this.props.ownPage) {
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