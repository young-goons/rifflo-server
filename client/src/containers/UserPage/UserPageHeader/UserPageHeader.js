import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Image, Button, Label, Modal } from 'semantic-ui-react';
import axios from 'axios';

import styles from './UserPageHeader.module.css';
import defaultProfileImage from '../../../resources/defaultProfileImage.jpg';
import defaultHeaderImage from '../../../resources/defaultHeaderImage.jpg';
import ImageUploader from "../ImageUploader/ImageUploader";
import { loadUserProfileImage, loadUserHeaderImage, uploadUserHeaderImage, deleteUserHeaderImage,
         uploadUserProfileImage, deleteUserProfileImage
} from "../../../store/actions/user";

class UserPageHeader extends Component {
    state = {
        isFollowed: null,
        followerArr: null,
        followingArr: null,
        profileImgModalOpen: false,
        profileImageReady: false,
        headerImgModalOpen: false,
        headerImageReady: false
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
            if (!this.state.headerImageReady) {
                this.props.onLoadUserHeaderImage(nextProps.userId);
                this.setState({headerImageReady: true});
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
        this.setState({profileImgModalOpen: false});
    };

    headerImgHandleOpen = () => {
        this.setState({headerImgModalOpen: true});
    };

    headerImgHandleClose = () => {
        this.setState({headerImgModalOpen: false});
    };

    render () {
        let followButtonDiv;
        let profileImgModal, profileImg;
        let headerImgModal, headerImg;
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
            profileImg = <img className={styles.profileImg} alt="profileImage"
                              src={this.props.profileImgSrc ? this.props.profileImgSrc : defaultProfileImage} />;
            headerImg = <img className={styles.headerImg} alt="headerImage"
                             src={this.props.headerImgSrc ? this.props.headerImgSrc : defaultHeaderImage} />;
        } else {
            profileImg = <img className={styles.profileImg + " " + styles.profileImgModal} alt="profileImage"
                              src={this.props.profileImgSrc ? this.props.profileImgSrc : defaultProfileImage}
                              onClick={this.profileImgHandleOpen} />;
            headerImg = <img className={styles.headerImg + " " + styles.headerImgModal} alt="headerImage"
                             src={this.props.headerImgSrc ? this.props.headerImgSrc : defaultHeaderImage }
                             onClick={this.headerImgHandleOpen} />;
            profileImgModal = (
                <Modal trigger={profileImg} size="small" centered={false}
                       open={this.state.profileImgModalOpen} onClose={this.profileImgHandleClose}>
                    <ImageUploader
                        userId={this.props.userId}
                        imgHandleClose={this.profileImgHandleClose}
                        onUploadImage={this.props.onUploadProfileImage}
                        onDeleteImage={this.props.onDeleteProfileImage}
                        aspectRatio={1 / 1}
                        newFilename="profileImage.jpeg"
                        headerSentence="Upload New Profile Picture"
                        cropDefaultWidth={150}
                        maxWidth={700}
                        maxHeight={700}
                        imageSrc={this.props.profileImgSrc}
                    />
                </Modal>
            );
            headerImgModal = (
                <Modal trigger={headerImg} size="large" centered={false}
                       open={this.state.headerImgModalOpen} onClose={this.headerImgHandleClose}>
                    <ImageUploader
                        userId={this.props.userId}
                        imgHandleClose={this.headerImgHandleClose}
                        onUploadImage={this.props.onUploadHeaderImage}
                        onDeleteImage={this.props.onDeleteHeaderImage}
                        aspectRatio={796 / 180}
                        newFilename="headerImage.jpeg"
                        headerSentence="Upload New Header Picture"
                        cropDefaultWidth={400}
                        maxwidth={1500}
                        maxHeight={1500}
                        imageSrc={this.props.headerImgSrc}
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
                        <div className={styles.headerImgDiv}>
                            { this.props.authUserId === this.props.userId ? headerImgModal : headerImg }
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
        profileImgSrc: state.user.profileImgSrc,
        headerImgSrc: state.user.headerImgSrc
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadUserProfileImage: (userId) => dispatch(loadUserProfileImage(userId)),
        onUploadProfileImage: (userId, formData) => dispatch(uploadUserProfileImage(userId, formData)),
        onDeleteProfileImage: (userId) => dispatch(deleteUserProfileImage(userId)),
        onLoadUserHeaderImage: (userId) => dispatch(loadUserHeaderImage(userId)),
        onUploadHeaderImage: (userId, formData) => dispatch(uploadUserHeaderImage(userId, formData)),
        onDeleteHeaderImage: (userId) => dispatch(deleteUserHeaderImage(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPageHeader);