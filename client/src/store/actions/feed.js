import axios from '../../shared/axios';
import * as actionTypes from './actionTypes';

export const loadFeedSuccess = (feedPostIdArr) => {
    return {
        type: actionTypes.LOAD_FEED_SUCCESS,
        feedPostIdArr: feedPostIdArr
    };
};

export const loadFeedFail = (error) => {
    return {
        type: actionTypes.LOAD_FEED_FAIL,
        error: error
    };
};

export const loadFeedPostsSuccess = (numPosts) => {
    return {
        type: actionTypes.LOAD_FEED_POSTS_SUCCESS,
        numPosts: numPosts
    };
};

export const loadFeedPostsFail = (error) => {
    return {
        type: actionTypes.LOAD_FEED_POSTS_FAIL,
        error: error
    };
};

export const loadFeed = () => {
    return dispatch => {
        const url = "/user/feed";
        axios({method: 'GET', url: url})
            .then(response => {
                dispatch(loadFeedSuccess(response.data.postIdArr));
            })
            .catch(error => {
                dispatch(loadFeedFail(error));
            })
    };
};