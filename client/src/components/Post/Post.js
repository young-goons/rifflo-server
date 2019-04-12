import React from 'react';

const Post = (props) => {
    return (
        <div>
            <div>
                {this.props.username}
            </div>
            <div>
                {this.props.date}
            </div>
            <div>
                {this.props.content}
            </div>
            <div>
                {this.props.tags}
            </div>
        </div>
    )
};

export default Post;