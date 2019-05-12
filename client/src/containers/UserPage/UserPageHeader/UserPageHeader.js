import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Image, Button, Label, Modal } from 'semantic-ui-react';
import axios from 'axios';

import styles from './UserPageHeader.module.css';
import backgroundImg from '../../../malibu_background.jpg'
import profileImage from '../../../yongkyun_profile_pic.jpg';
import ProfilePictureUploader from "../ProfilePictureUploader/ProfilePictureUploader";
import { loadUserProfileImage } from "../../../store/actions/user";

class UserPageHeader extends Component {
    state = {
        isFollowed: null,
        followerArr: null,
        followingArr: null,
        profileImgModalOpen: false,
        profileImageReady: false
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
            if (this.state.isFollowed === null && this.state.followerArr === null) {
                this.getFollowers(nextProps.userId);
            }
            if (this.state.followingArr === null) {
                this.getFollowing(nextProps.userId);
            }
            if (!this.state.profileImageReady) {
                this.props.onLoadUserProfileImage(nextProps.userId);
                this.setState({profileImageReady: true});
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

    profileImgHandleOpen = () => {
        this.setState({profileImgModalOpen: true});
    };

    profileImgHandleClose = () => {
        console.log("close modal");
        this.setState({profileImgModalOpen: false});
    };

    render () {
        let followButtonDiv;
        let profileImgModal;
        let profileImg;
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
            profileImg = <img className={styles.profileImg} src={this.props.profileImgSrc} />;
        } else {
            profileImg = <img className={styles.profileImg + " " + styles.profileImgModal}
                              src={this.props.profileImgSrc} onClick={this.profileImgHandleOpen}/>;
            profileImgModal = (
                <Modal trigger={profileImg} size="small" centered={false}
                       open={this.state.profileImgModalOpen} onClose={this.profileImgHandleClose}>
                    <ProfilePictureUploader
                        userId={this.props.userId}
                        profileImgHandleClose={this.profileImgHandleClose}
                    />
                </Modal>
            );
        }

        return (
            <Grid>
                <Grid.Row>
                    <div className={styles.usernameDiv}>{this.props.username}</div>
                    { this.props.authUserId === this.props.userId ? profileImgModal : profileImg }
                    { followButtonDiv }
                    <Grid.Column width={16}>
                        <div className={styles.backgroundImgDiv}>
                            <Image fluid className={styles.backgroundImg}
                                   src={backgroundImg}/>
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

const mapStateToProps = state => {
    return {
        profileImgSrc: state.user.profileImgSrc
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadUserProfileImage: (userId) => dispatch(loadUserProfileImage(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPageHeader);