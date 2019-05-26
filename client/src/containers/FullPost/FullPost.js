import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../shared/axios';
import SiteHeader from '../SiteHeader/SiteHeader';
import AuthPage from '../AuthPage/AuthPage';
import Post from './Post/Post';
import NoPostPage from '../../components/ErrorPage/NoPostPage/NoPostPage';
import styles from './FullPost.module.css';
import { loadAuthUser } from '../../store/actions/auth';

class FullPost extends Component {
    state = {
        authUserId: this.props.authUserId,
        post: null,
        isPostLoaded: false
    };

    componentDidMount() {
        if (this.state.authUserId) {
            if (!this.props.authUserInfo) {
                console.log("loading user info");
                this.props.onLoadUser(this.state.authUserId);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.authUserInfo) {
            this.loadPost();
        } else {
            this.setState({
                authUserId: null,
                comment: ''
            })
        }
    }

    commentInputHandler = (event) => {
        this.setState({comment: event.target.value});
    };

    loadPost = () => {
        const url = "/post/" + this.props.match.params.postId;
        axios({method: 'GET', url: url})
            .then(response => {
                // this.setState(post: response.data.)
                const post = response.data.posts[this.props.match.params.postId];
                if (post) {
                    this.setState({post: post, isPostLoaded: true});
                } else {
                    this.setState({post: null, isPostLoaded: true});
                }
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
    };

    render() {
        let renderDiv;
        if (this.props.authUserInfo) {
            let postPageDiv;
            const siteHeader = <SiteHeader userInfo={this.props.authUserInfo}/>;
            if (this.state.isPostLoaded && this.state.post) {
                postPageDiv = (
                    <Post
                        postId={this.state.post.postId}
                        userId={this.state.post.userId}
                        username={this.state.post.username}
                        songName={this.state.post.songName}
                        artist={this.state.post.artist}
                        tags={this.state.post.tags}
                        content={this.state.post.content}
                        uploadDate={this.state.post.uploadDate}
                        currUserId={this.state.authUserId}
                        currUsername={this.props.authUserInfo.username}
                    />
                );
            } else if (this.state.isPostLoaded && this.state.post === null) {
                postPageDiv = (
                    <NoPostPage/>
                );
            }
            renderDiv = (
                <div className={styles.renderDiv}>
                    { siteHeader }
                    { postPageDiv }
                </div>
            );
        } else if (this.state.authUserId) {
            renderDiv = <div></div>;
        } else {
            renderDiv = <AuthPage/>;
        }
        return (
            <div className={styles.fullPostDiv}>
                { renderDiv }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUserInfo: state.auth.authUserInfo,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadUser: (userId) => dispatch(loadAuthUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FullPost);