import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Grid, Column, Container } from 'semantic-ui-react';

import SiteHeader from '../SiteHeader/SiteHeader';
import Post from '../Feed/Post/Post';
import UserPageHeader from './UserPageHeader/UserPageHeader';
import PostList from './SharedPost/SharedPost';
import NoUserPage from '../../components/ErrorPage/NoUserPage/NoUserPage';
import PostEditor from './PostEditor/PostEditor';
import styles from './UserPage.module.css';

class UserPage extends Component {
    state = {
        isUserPageLoaded: false,
        postArr: [],
        userId: null,
        authUserInfo: null,
        isSignedOut: false,
        isFollowed: null,
        followerCnt: null
    };

    componentDidMount() {
        console.log("component did mount in UserPage.js")
        if (!this.state.isUserPageLoaded && this.props.userInfo) {
            if (this.state.userId) {
                console.log("loading user posts in componentDidMount");
                this.loadUserPosts();
            } else {
                this.getUserId();
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.userInfo) {
            this.setState({authUserInfo: nextProps.userInfo});
            this.getUserId();
        } else if (nextProps.isAuthenticated === false) { // signing out
            this.setState({isSignedOut: true});
        }
    }

    componentDidUpdate() {
        if (!this.state.isUserPageLoaded && this.state.userId && this.state.authUserInfo) {
            console.log("load user posts");
            this.loadUserPosts();
        }
    }

    getUserId = () => {
        const userExistsUrl = "http://127.0.0.1:5000/user/id/username/" + this.props.match.params.username;
        axios({method: 'GET', url: userExistsUrl})
            .then(response => {
                console.log(response);
                if (response.data.userId) {
                    console.log("userid begin set");
                    this.setState({userId: response.data.userId});
                } else {
                    console.log('userid does not exist');
                    this.setState({isUserPageLoaded: true, authUserInfo: null});
                }
            })
    };

    loadUserPosts = () => {
        const userPostUrl = "http://127.0.0.1:5000/user/" + this.state.userId + "/posts";
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        let postIdArr;
        axios({method: 'GET', url: userPostUrl, headers: requestHeaders})
            .then(response => {
                postIdArr = response.data.postIdArr;
                if (postIdArr.length === 0) {
                    return;
                }
                const postUrl = "http://127.0.0.1:5000/posts/" + postIdArr.join(',');
                return axios({method: 'GET', url: postUrl, headers: requestHeaders});
            })
            .then(response => {
                if (response) {
                    const postArr = [];
                    for (let i = 0; i < postIdArr.length; i++) {
                        if (postIdArr[i] in response.data.posts) {
                            postArr.push(response.data.posts[postIdArr[i]]);
                        }
                    }
                    this.setState({
                        isUserPageLoaded: true,
                        postArr: postArr
                    })
                }
            })
            .catch(error => {
                alert(error);
            })
    };

    render() {
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

        let siteHeader = null;
        let postUploadDiv = <div></div>;
        if (this.props.userInfo) {
            siteHeader = <SiteHeader userInfo={this.props.userInfo}/>;
            if (this.props.userInfo.username === username) {
                postUploadDiv = (
                    <PostEditor/>
                );
            }
        }

        // TODO: retrieve info of the owner of the user page
        let userPageDiv;
        if (this.state.userId === null) {
            userPageDiv = <NoUserPage isAuthenticated={this.state.isAuthenticated}/>;
        } else {
            if (this.state.isSignedOut) {
                userPageDiv = <Redirect to="/signin"/>
            } else {
                console.log(this.props.userInfo);
                userPageDiv = (
                    <div className={styles.userPageContainerDiv}>
                        <UserPageHeader
                            userId={this.props.userInfo.userId}
                            username={this.props.match.params.username}
                            ownPage={this.props.match.params.username === this.props.userInfo.username}
                        />
                        <div className={styles.userPageContentDiv}>
                            {postUploadDiv}
                            {postDivArr}
                        </div>
                    </div>
                );
            }
        }

        return (
            <div className={styles.containerDiv} ref={this.contextRef}>
                { siteHeader }
                { userPageDiv }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.auth.userInfo,
        isAuthenticated: state.auth.isAuthenticated
    };
};

export default connect(mapStateToProps)(UserPage);