import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Grid, Column, Container } from 'semantic-ui-react';

import SiteHeader from '../SiteHeader/SiteHeader';
import AuthPage from '../AuthPage/AuthPage';
import Post from '../Feed/Post/Post';
import UserPageHeader from './UserPageHeader/UserPageHeader';
import PostList from './SharedPost/SharedPost';
import NoUserPage from '../../components/ErrorPage/NoUserPage/NoUserPage';
import PostEditor from './PostEditor/PostEditor';
import styles from './UserPage.module.css';
import { loadUser } from "../../store/actions/auth";
import { loadUserPosts, loadUserUpdatedPosts } from "../../store/actions/user";

class UserPage extends Component {
    state = {
        authUserId: this.props.authUserId,
        authUserInfo: null,
        isUserPageLoaded: false,
        userId: null,
        isSignedOut: false,
        isFollowed: null,
        followerCnt: null,
        postArr: []
    };

    componentDidMount() {
        console.log(this.props.postArr);
        if (this.state.authUserId) {
            if (!this.props.authUserInfo) {
                console.log("loading user info");
                this.props.onLoadUser(this.state.authUserId);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.authUserInfo) {
            if (!nextProps.postArr && !nextProps.newPostId) { // upon sign in
                this.setState({authUserInfo: nextProps.authUserInfo});
                this.getUserId();
            } else if (nextProps.postArr && !nextProps.newPostId) { // upon loading initial post
                this.setState({postArr: nextProps.postArr});
            } else if (nextProps.postArr && nextProps.newPostId) { // upon loading updatedPost
                if (this.state.postArr.length === nextProps.postArr.length) { // get new post Id
                    this.props.onLoadUserUpdatedPosts(nextProps.newPostId, this.state.postArr)
                } else { // get updated postArr
                    this.setState({postArr: nextProps.postArr});
                }
            }
        } else { // upon sign out
            this.setState({
                authUserId: null,
                authUserInfo: null,
                isUserPageLoaded: false,
                userId: null,
                isSignedOut: false,
                isFollowed: null,
                followerCnt: null,
                uploadContent: "",
                uploadTags: ""
            });
        }
    }

    componentDidUpdate() {
        if (!this.props.postLoaded && this.state.userId && this.state.authUserInfo) {
            console.log("load user posts");
            this.props.onLoadUserPosts(this.state.userId);
        }
    }

    getUserId = () => {
        const userExistsUrl = "http://127.0.0.1:5000/user/id/username/" + this.props.match.params.username;
        axios({method: 'GET', url: userExistsUrl})
            .then(response => {
                if (response.data.userId) {
                    console.log("userid begin set");
                    this.setState({userId: response.data.userId});
                } else {
                    console.log('userid does not exist');
                    this.setState({isUserPageLoaded: true, authUserInfo: null});
                }
            })
    };

    render() {
        let renderDiv;
        const username = this.props.match.params.username;
        // TODO: psuedo-randomize the order
        const postDivArr = this.state.postArr.map((post, idx) => {
            return (
                <div key={idx} className={styles.postListDiv}>
                    <PostList
                        songName={post.songName}
                        artist={post.artist}
                        tags={post.tags}
                    />
                </div>
            );
        });

        if (this.props.authUserInfo) {
            let userPageDiv;
            const siteHeader = <SiteHeader userInfo={this.props.authUserInfo}/>;
            if (this.state.isUserPageLoaded && this.state.userId === null) {
                userPageDiv = <NoUserPage/>;
            } else {
                let postUploadDiv;
                if (this.props.authUserInfo.username === username) {
                    postUploadDiv = (
                        <PostEditor/>
                    );
                }
                userPageDiv = (
                    <div className={styles.userPageContainerDiv}>
                        <UserPageHeader
                            authUserId={this.state.authUserId}
                            userId={this.state.userId}
                            username={this.props.match.params.username}
                            shareCnt={this.state.postArr.length}
                        />
                        <div className={styles.userPageContentDiv}>
                            {postUploadDiv}
                            {postDivArr}
                        </div>
                    </div>
                );
            }
            renderDiv = (
                <div className={styles.containerDiv} ref={this.contextRef}>
                    { siteHeader }
                    { userPageDiv }
                </div>
            );
        } else if (this.state.authUserId) {
            renderDiv = <div></div>;
        } else {
            renderDiv = <AuthPage/>;
        }

        return (
            <div className={styles.containerDiv}>
                { renderDiv }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUserInfo: state.auth.authUserInfo,
        isAuthenticated: state.auth.isAuthenticated,
        postArr: state.user.postArr,
        postLoaded: state.user.postLoaded,
        newPostId: state.upload.newPostId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadUser: (userId) => dispatch(loadUser(userId)),
        onLoadUserPosts: (userId) => dispatch(loadUserPosts(userId)),
        onLoadUserUpdatedPosts: (postId, postArr) => dispatch(loadUserUpdatedPosts(postId, postArr))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
