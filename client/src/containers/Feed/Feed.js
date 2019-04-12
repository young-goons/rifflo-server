import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from "axios";

import Post from '../../components/Post/Post';
import { FEED_POSTS_LOAD_NUM } from "../../shared/config";

class Feed extends Component {
    state = {
        isFeedLoaded: false,
        feedPostIdArr: [],
        feedPostIdx: 0, // the next post index to be fetched from feedPostIdArr
        postArr: []
    };

    numPosts = FEED_POSTS_LOAD_NUM;

    componentDidMount() {
        if (!this.state.isFeedLoaded) {
            console.log("initial feed load")
            this.loadFeed(this.loadFeedPosts);
        }
    }

    loadFeed = (callback) => {
        const url = "http://127.0.0.1:5000/user/feed";
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        console.log("load feed");
        axios({method: 'GET', url: url, headers: requestHeaders})
            .then(response => {
                console.log(response);
                this.setState({
                    feedPostIdArr: response.data.postIdArr,
                    isFeedLoaded: true
                }, callback);
            })
            .catch(error => {
                alert(error);
            })
    };

    loadFeedPostsHandler = () => {
        console.log(this.state.feedPostIdx, this.numPosts, this.state.feedPostIdArr.length);
        if (this.state.feedPostIdx + this.numPosts > this.state.feedPostIdArr.length) {
            this.setState({
                feedPostIdx: 0
            }, this.loadFeed(this.loadFeedPosts));
            // this.loadFeed(this.loadFeedPosts);
        } else {
            this.loadFeedPosts();
        }
    };

    /**
     * Load post contents of posts in this.props.feedPostIdArr
     * @param numPosts      Number of posts to fetch
     */
    loadFeedPosts = () => {
        // assume that postIds in feedPostIdArr are valid to fetch

        // if there is not enough feed ids in the list, reload feed
        // set a fixed number to reload i.e. if less than that amount of post is left

        // TODO: Do something if this.state.feedPostidArr

        const postIds = this.state.feedPostIdArr.slice(this.state.feedPostIdx,
            this.state.feedPostIdx + this.numPosts);
        const url = "http://127.0.0.1:5000/posts/" + postIds.join(',');
        axios({method: 'GET', url: url})
            .then(response => {
                console.log(response.data.postArr);
                this.setState({
                    postArr: this.state.postArr.concat(response.data.postArr),
                    feedPostIdx: this.state.feedPostIdx + this.numPosts
                });
            })
            .catch(error => {
                alert(error);
            });
    };

    render() {
        const postDivArr = this.state.postArr.map((post) => {
            return (
                <div key={post.post_id}>
                    <Post
                        username={post.username}
                        date={post.date}
                        content={post.content}
                        tags={post.tags}
                    />
                </div>
            )
        });
        return (
            <div>
                Feed
                <button onClick={() => this.loadFeedPostsHandler(2)}>
                    Show More
                </button>
                <button>
                    Refresh
                </button>
            </div>
        );
    }
}

// const mapStateToProps = state => {
//     return {
//         isFeedLoaded: state.feed.isFeedLoaded,
//         feedPostIdArr: state.feed.feedPostIdArr,
//         feedPostIdx: state.feed.feedPostIdx
//     };
// };
//
// const mapDispatchToProps = dispatch => {
//     return {
//         onLoadFeed: () => dispatch(loadFeed()),
//         onLoadFeedPostsSuccess: (numPosts) => dispatch(loadFeedPostsSuccess(numPosts)),
//         onLoadFeedPostsFail: (error) => dispatch(loadFeedPostsFail(error))
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Feed);
export default Feed;