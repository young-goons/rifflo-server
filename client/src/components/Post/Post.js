import React from 'react';

const Post = (props) => {
    return (
        <div>
            <div>
                {props.username}
            </div>
            <div>
                {props.date}
            </div>
            <div>
                {props.content}
            </div>
            <div>
                {props.tags}
            </div>
        </div>
    )
};

export default Post;