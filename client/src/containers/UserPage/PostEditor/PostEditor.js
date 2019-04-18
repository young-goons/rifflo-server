import React, { Component } from 'react';
import axios from 'axios';

import styles from './PostEditor.module.css';

class PostEditor extends Component {
    state = {
        content: '',
        tags: ''
    };

    contentInputHandler = (event) => {
        this.setState({
            content: event.target.value
        });
    };

    tagsInputHandler = (event) => {
        this.setState({
            tags: event.target.value
        })
    };

    // TODO: error handling (if the content is too long)
    sharePostHandler = () => {
        const url = "http://127.0.0.1:5000/user/upload/post";
        const requestData = {
            content: this.state.content,
            tags: this.state.tags
        };
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        axios({method: 'POST', url: url, data: requestData, headers: requestHeaders})
            .then(response => {
                console.log(response);
                alert("Shared successfully");
            })
            .catch(error => {
                alert(error);
            })
    };

    render() {
        return (
            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Write tags"
                        onChange={this.tagsInputHandler}
                        value={this.state.tags}
                    />
                    <textarea
                        placeholder="Write Post"
                        onChange={this.contentInputHandler}
                        value={this.state.content}
                    />
                </div>
                <button onClick={this.sharePostHandler}>Share</button>
            </div>
        );
    }
}

export default PostEditor