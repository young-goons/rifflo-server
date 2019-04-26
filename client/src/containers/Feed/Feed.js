import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import { Redirect } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Post from './Post/Post';
import SiteHeader from '../SiteHeader/SiteHeader';
import { FEED_POSTS_LOAD_NUM } from "../../shared/config";
import styles from './Feed.module.css';

class Feed extends Component {
    state = {
        isFeedLoaded: false,
        feedPostIdArr: [],
        feedPostIdx: 0, // the next post index to be fetched from feedPostIdArr
        postArr: []
    };

    numPosts = FEED_POSTS_LOAD_NUM;

    contextRef = createRef();

    componentDidMount() {
        // TODO: need to try to authenticate?
        if (this.props.isAuthenticated && !this.state.isFeedLoaded) {
            console.log("initial feed load")
            this.loadFeed(true, this.loadFeedPosts);
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
        let url = "http://127.0.0.1:5000/posts/" + postIdArr.join(',');
        const postArr = [];
        axios({method: 'GET', url: url})
            .then(response => {
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
                alert(error);
            });

    };

    render() {
        let authRedirect = null;
        let siteHeader = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/signin"/>;
        } else {
            siteHeader = <SiteHeader contextRef={this.contextRef} userInfo={this.props.userInfo}/>;
        }
        const postDivArr = this.state.postArr.map((post, idx) => {
            return (
                <div key={idx}>
                    <Post
                        postId={this.state.feedPostIdArr[idx]}
                        currUserId={this.props.userInfo.userId}
                        currUsername={this.props.userInfo.username}
                        userId={post.userId}
                        username={post.username}
                        date={post.uploadDate}
                        content={post.content}
                        tags={post.tags}
                        followerCnt={post.followerCnt}
                    />
                </div>
            )
        });
        const feedDiv = (
            <div className={styles.feedDiv}>
                { postDivArr }
                <button onClick={() => this.loadFeedPostsHandler()}>
                    Show More
                </button>
                <button onClick={() => this.loadFeed(true, this.loadFeedPosts)}>
                    Refresh
                </button>
            </div>
        );
        return (
            <div className={styles.containerDiv} ref={this.contextRef}>
                { authRedirect }
                { siteHeader }
                { feedDiv }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        authRedirectPath: state.auth.authRedirectPath,
        userInfo: state.auth.userInfo
    };
};

export default connect(mapStateToProps)(Feed);