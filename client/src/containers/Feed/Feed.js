import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import axios from "axios";

import Post from './Post/Post';
import SiteHeader from '../SiteHeader/SiteHeader';
import AuthPage from '../AuthPage/AuthPage';
import { FEED_POSTS_LOAD_NUM } from "../../shared/config";
import styles from './Feed.module.css';
import { loadUser } from "../../store/actions/auth";

class Feed extends Component {
    state = {
        authUserId: this.props.authUserId,
        isFeedLoaded: false,
        feedPostIdArr: [],
        feedPostIdx: 0, // the next post index to be fetched from feedPostIdArr
        postArr: []
    };

    // numPosts = FEED_POSTS_LOAD_NUM;
    numPosts = 2;

    contextRef = createRef();

    componentDidMount() {
        if (this.state.authUserId) {
            if (!this.props.authUserInfo) {
                console.log("loading user info");
                this.props.onLoadUser(this.state.authUserId);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.authUserInfo) { // upon sign in
            this.loadFeed(true, this.loadFeedPosts);
        } else { // upon sign out
            this.setState({
                authUserId: null,
                isFeedLoaded: false,
                feedPostIdArr: [],
                feedPostIdx: 0,
                postArr: []
            });
        }
    }

    /**
     * Load ids of posts on the feed
     * @param isNewLoad True if initializing feedPostIdArr again
     *                  False if obtaining new feedPostIdArr and concatenating
     * @param callback  callback function to load the first this.numPosts
     *                  of ids in the feedPostIdArr
     */
    loadFeed = (isNewLoad, callback) => {
        const url = "http://127.0.0.1:5000/user/feed";
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        console.log("load feed");
        axios({method: 'GET', url: url, headers: requestHeaders})
            .then(response => {
                console.log(response.data);
                let updatedState;
                if (isNewLoad) {
                    updatedState = {
                        feedPostIdArr: response.data.postIdArr,
                        isFeedLoaded: true,
                        feedPostIdx: 0,
                        postArr: []
                    };
                } else {
                    updatedState = {
                        feedPostIdArr: this.state.feedPostIdArr.concat(response.data.postIdArr),
                        isFeedLoaded: true
                    };
                }
                this.setState(updatedState, callback);
            })
            .catch(error => {
                console.log(error);
                alert(error);
            })
    };

    loadFeedPostsHandler = () => {
        console.log(this.state.feedPostIdx, this.state.feedPostIdArr.length);
        if (this.state.feedPostIdx + this.numPosts > this.state.feedPostIdArr.length) {
            this.loadFeed(false, this.loadFeedPosts);
        } else {
            this.loadFeedPosts();
        }
    };

    /**
     * Load post contents of posts in this.props.feedPostIdArr
     */
    loadFeedPosts = () => {
        // assume that postIds in feedPostIdArr are valid to fetch

        // if there is not enough feed ids in the list, reload feed
        // set a fixed number to reload i.e. if less than that amount of post is left

        // TODO: Do something if this.state.feedPostidArr

        const postIdArr = this.state.feedPostIdArr.slice(this.state.feedPostIdx,
            this.state.feedPostIdx + this.numPosts);
        let url = "http://127.0.0.1:5000/post/" + postIdArr.join(',');
        const postArr = [];
        axios({method: 'GET', url: url})
            .then(response => {
                console.log(response);
                for (let i = 0; i < postIdArr.length; i++) {
                    if (postIdArr[i] in response.data.posts) {
                        postArr.push(response.data.posts[postIdArr[i]]);
                    }
                }
                this.setState({
                    postArr: this.state.postArr.concat(postArr),
                    feedPostIdx: this.state.feedPostIdx + this.numPosts
                });
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
    };

    render() {
        let renderDiv;
        if (this.props.authUserInfo) { // load posts after user info is loaded
            const siteHeader = <SiteHeader contextRef={this.contextRef} userInfo={this.props.authUserInfo}/>;
            const postDivArr = this.state.postArr.map((post, idx) => {
                return (
                    <div key={idx}>
                        <Post
                            postId={this.state.feedPostIdArr[idx]}
                            currUserId={this.props.authUserInfo.userId}
                            currUsername={this.props.authUserInfo.username}
                            userId={post.userId}
                            username={post.username}
                            date={post.uploadDate}
                            content={post.content}
                            tags={post.tags}
                            followerCnt={post.followerCnt}
                            songName={post.songName}
                            artist={post.artist}
                        />
                    </div>
                )
            });

            const showMoreButton = (
                <button onClick={() => this.loadFeedPostsHandler()}>
                    Show More
                </button>
            );

            const refreshButton = (
                <button onClick={() => this.loadFeed(true, this.loadFeedPosts)}>
                    Refresh
                </button>
            );

            const feedDiv = (
                <div className={styles.feedDiv}>
                    { postDivArr }
                    { this.state.postArr.length > 0 ? refreshButton : null}
                    { this.state.postArr.length > 0 ? showMoreButton : null}
                </div>
            );

            renderDiv = (
                <div className={styles.containerDiv} ref={this.contextRef}>
                    { siteHeader }
                    { feedDiv }
                </div>
            );
            console.log("Feed loaded");
        } else if (this.state.authUserId) {
            renderDiv = <div></div>;
        } else { // authPage;
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
        authUserInfo: state.auth.authUserInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadUser: (userId) => dispatch(loadUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);