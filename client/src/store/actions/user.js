import * as actionTypes from './actionTypes';
import axios from "axios";

export const loadUserPostsSuccess = (postArr) => {
    console.log(postArr);
    console.log(actionTypes.LOAD_USER_POSTS_SUCCESS);
    return {
        type: actionTypes.LOAD_USER_POSTS_SUCCESS,
        postArr: postArr
    };
};

export const loadUserPostsFail = (error) => {
    return {
        type: actionTypes.LOAD_USER_POSTS_FAIL,
        error: error
    };
};

export const loadUserPosts = (userId) => {
    return dispatch => {
        const userPostUrl = "http://127.0.0.1:5000/user/" + userId + "/posts";
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        let postIdArr;
        axios({method: 'GET', url: userPostUrl, headers: requestHeaders})
            .then(response => {
                postIdArr = response.data.postIdArr;
                if (postIdArr.length === 0) {
                    return;
                }
                const postUrl = "http://127.0.0.1:5000/post/" + postIdArr.join(',');
                return axios({method: 'GET', url: postUrl, headers: requestHeaders});
            })
            .then(response => {
                if (response) {
                    const postArr = [];
                    for (let i = 0; i < postIdArr.length; i++) {
                        if (postIdArr[i] in response.data.posts) {
                            postArr.push(response.data.posts[postIdArr[i]]);
                        }
                    }
                    console.log(postArr);
                    dispatch(loadUserPostsSuccess(postArr));
                }
            })
            .catch(error => {
                console.log(error);
                alert(error);
                dispatch(loadUserPostsFail(error));
            })
    }
};