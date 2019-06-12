import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../shared/axios';
import SiteHeader from '../SiteHeader/SiteHeader';
import AuthPage from '../AuthPage/AuthPage';
import UserPageHeader from './UserPageHeader/UserPageHeader';
import SharedPost from './SharedPost/SharedPost';
import History from './History/History';
import FollowList from './FollowList/FollowList';
import NoUserPage from '../../components/ErrorPage/NoUserPage/NoUserPage';
import PostEditor from './PostEditor/PostEditor';
import styles from './UserPage.module.css';
import { loadAuthUser } from "../../store/actions/auth";
import { loadUserPosts, loadUserUpdatedPosts } from "../../store/actions/user";

class UserPage extends Component {
    state = {
        authUserId: this.props.authUserId,
        authUserInfo: null,
        isUserPageLoaded: false,
        userId: null,
        userInfo: null,
        isSignedOut: false,
        isFollowed: null,
        followerCnt: null,
        postArr: [],
        postLoadReq: false,
        pageContent: 'shares', // one of "shares", "followers", "following", "history",
        isClipPlaying: null
    };

    componentDidMount() {
        console.log("component mounted");
        if (this.state.authUserId) {
            if (!this.props.authUserInfo) {
                this.props.onLoadAuthUser(this.state.authUserId);
            }
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.authUserInfo) {
            if (!nextProps.postArr && !nextProps.newPostId) { // upon sign in
                this.setState({
                    authUserId: nextProps.authUserInfo.userId,
                    authUserInfo: nextProps.authUserInfo
                });
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
        if (!this.props.postLoaded && this.state.userId && this.state.authUserInfo && !this.state.postLoadReq) {
            console.log("load user posts");
            this.setState({postLoadReq: true});
            this.props.onLoadUserPosts(this.state.userId);
        }
    }

    getUserId = () => {
        const userExistsUrl = "/user/id/username/" + this.props.match.params.username;
        axios({method: 'GET', url: userExistsUrl})
            .then(response => {
                if (response.data.userId) {
                    this.setState({isUserPageLoaded: true, userId: response.data.userId});
                } else {
                    this.setState({isUserPageLoaded: true, authUserInfo: null});
                }
            })
    };

    sharesClickHandler = () => {
        this.setState({pageContent: 'shares'});
    };

    historyClickHandler = () => {
        this.setState({pageContent: 'history'});
    };

    followersClickHandler = () => {
        this.setState({pageContent: 'followers'});
    };

    followingClickHandler = () => {
        this.setState({pageContent: 'following'});
    };

    startPlayingClip = (postId) => {
        this.setState({isClipPlaying: postId});
    };

    endPlayingClip = () => {
        this.setState({isClipPlaying: null});
    };

    render() {
        let renderDiv, contentDiv;
        const username = this.props.match.params.username;
        // TODO: psuedo-randomize the order
        const postDivArr = this.state.postArr.map((post, idx) => {
            return (
                <div key={idx} className={styles.postListDiv}>
                    <SharedPost
                        postId={post.postId}
                        songName={post.songName}
                        artist={post.artist}
                        tags={post.tags}
                        urlObj={post.urlObj}
                        startPlayingClip={this.startPlayingClip}
                        endPlayingClip={this.endPlayingClip}
                        isClipPlaying={this.state.isClipPlaying}
                    />
                </div>
            );
        });

        if (this.state.pageContent === 'shares') {
            contentDiv = postDivArr;
        } else if (this.state.pageContent === 'followers') {
            contentDiv = <FollowList followType='followers' userId={this.state.userId}/>;
        } else if (this.state.pageContent === 'following') {
            contentDiv = <FollowList followType='following' userId={this.state.userId}/>;
        } else if (this.state.pageContent === 'history') {
            contentDiv = <History authUserId={this.state.authUserId} userId={this.state.userId}/>
        }

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
                            userInfo={this.props.userInfo}
                            shareCnt={this.state.postArr.length}
                            history={this.props.history}
                            sharesClickHandler={this.sharesClickHandler}
                            historyClickHandler={this.historyClickHandler}
                            followersClickHandler={this.followersClickHandler}
                            followingClickHandler={this.followingClickHandler}
                        />
                        <div className={styles.userPageContentDiv}>
                            { this.state.pageContent === 'shares' ? postUploadDiv : null }
                            { contentDiv }
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
        userInfo: state.user.userInfo,
        postArr: state.user.postArr,
        postLoaded: state.user.postLoaded,
        newPostId: state.upload.newPostId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadAuthUser: (userId) => dispatch(loadAuthUser(userId)),
        onLoadUserPosts: (userId) => dispatch(loadUserPosts(userId)),
        onLoadUserUpdatedPosts: (postId, postArr) => dispatch(loadUserUpdatedPosts(postId, postArr))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
