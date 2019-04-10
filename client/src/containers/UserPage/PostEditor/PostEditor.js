import React, { Component } from 'react';

class PostEditor extends Component {
    state = {
        content: ''
    };

    contentInputHandler = (event) => {
        this.setState({
            content: event.target.value
        });
    };

    render() {
        return (
            <div>
                <input
                    type="text"
                    placeholder="Write Post"
                    onChange={this.contentInputHandler}
                    value={this.state.content}
                />
            </div>
        );
    }
}

export default PostEditor