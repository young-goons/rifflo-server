import React from 'react';

const Post = (props) => {
    return (
        <div>
            <div>
                username - {props.username}
            </div>
            <div>
                date - {props.date}
            </div>
            <div>
                content - {props.content}
            </div>
            <div>
                tags - {props.tags}
            </div>
        </div>
    )
};

export default Post;