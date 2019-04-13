import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Post from '../../components/Post/Post';
import PostEditor from './PostEditor/PostEditor';
import { parseJWT } from '../../shared/utils';

class UserPage extends Component {
    state = {
        jwtIdentity: null,
        isUserPageLoaded: false,
        postArr: []
    };

    componentDidMount() {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken && this.state.jwtIdentity === null) {
            this.setState({jwtIdentity: parseJWT(accessToken)['identity']});
        }
        if (!this.state.isUserPageLoaded) {
            this.loadUserPosts();
        }
    }

    loadUserPosts = () => {
        const userPostUrl = "http://127.0.0.1:5000/user/" + this.props.match.params.username + "/posts";
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        let postIdArr;
        axios({method: 'GET', url: userPostUrl, headers: requestHeaders})
            .then(response => {
                console.log(response.data);
                postIdArr = response.data.postIdArr;
                const postUrl = "http://127.0.0.1:5000/posts/" + postIdArr.join(',');
                return axios({method: 'GET', url: postUrl, headers: requestHeaders});
            })
            .then(response => {
                console.log(response.data);
                const postArr = [];
                for (let i = 0; i < postIdArr.length; i++) {
                    if (postIdArr[i] in response.data.posts) {
                        postArr.push(response.data.posts[postIdArr[i]]);
                    }
                }
                console.log(postArr);
                this.setState({
                    isUserPageLoaded: true,
                    postArr: postArr
                })
            })
            .catch(error => {
                alert(error);
            })
    };

    render() {
        const username = this.props.match.params.username;
        const postDivArr = this.state.postArr.map((post, idx) => {
            return (
                <div key = {idx}>
                    <Post
                        username={username}
                        date={post.uploadDate}
                        content={post.content}
                        tags={post.tags}
                    />
                </div>
            );
        });
        let postUploadDiv = <div></div>;
        if (this.state.jwtIdentity != null && this.state.jwtIdentity.username === username) {
            postUploadDiv = (
                <PostEditor/>
            );
        }
        return (
            <div>
                User Page of {username}
                {postDivArr}
                {postUploadDiv}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.auth.userInfo
    };
};

export default connect(mapStateToProps)(UserPage);