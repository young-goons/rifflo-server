import * as actionTypes from './actionTypes';
import axios from "axios";

export const loadUserPostsSuccess = (postArr) => {
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

export const loadUserProfileImageSuccess = (imageSrc) => {
    return {
        type: actionTypes.LOAD_USER_PROFILE_IMAGE_SUCCESS,
        profileImgSrc: imageSrc
    };
};

export const loadUserHeaderImageSuccess = (imageSrc) => {
    return {
        type: actionTypes.LOAD_USER_HEADER_IMAGE_SUCCESS,
        headerImgSrc: imageSrc
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
                const postArr = [];
                if (response) {
                    for (let i = 0; i < postIdArr.length; i++) {
                        if (postIdArr[i] in response.data.posts) {
                            postArr.push(response.data.posts[postIdArr[i]]);
                        }
                    }
                }
                console.log(postArr);
                dispatch(loadUserPostsSuccess(postArr));
            })
            .catch(error => {
                console.log(error);
                alert(error);
                dispatch(loadUserPostsFail(error));
            })
    };
};

export const loadUserUpdatedPosts = (postId, postArr) => {
    return dispatch => {
        const url = "http://127.0.0.1:5000/post/" + postId;
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken'),
        };
        axios({method: 'GET', url: url, headers: requestHeaders})
            .then(response => {
                const updatedPostArr = [...postArr, response.data.posts[postId]];
                dispatch(loadUserPostsSuccess(updatedPostArr));
            })
            .catch(error => {
                console.log(error);
            });
    };
};

export const loadUserProfileImage = (userId) => {
    return dispatch => {
        let url = "http://127.0.0.1:5000/user/" + userId + "/profile/image";
        axios({method: 'GET', url: url})
            .then(response => {
                dispatch(loadUserProfileImageSuccess(url + "?" + Date.now()));
            })
            .catch(error => {
                console.log(error);
            })
    };
};

export const uploadUserProfileImage = (userId, formData) => {
    return dispatch => {
        let url = "http://127.0.0.1:5000/user/" + userId + "/profile/image";
        console.log("uploading profile image");
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken'),
            'Content-Type': 'multipart/form-data'
        };
        axios({method: 'POST', url: url, headers: requestHeaders, data: formData})
            .then(response => {
                dispatch(loadUserProfileImageSuccess(url + "?" + Date.now()));
            })
            .catch(error => {
                console.log(error);
            })
    }
};

export const loadUserHeaderImage = (userId) => {
    return dispatch => {
        let url = "http://127.0.0.1:5000/user/" + userId + "/header/image";
        axios({method: 'GET', url: url})
            .then(response => {
                console.log(response);
                dispatch(loadUserHeaderImageSuccess(url + "?" + Date.now()));
            })
            .catch(error => {
                console.log(error);
            })
    };
};

export const uploadUserHeaderImage = (userId, formData) => {
    return dispatch => {
        let url = "http://127.0.0.1:5000/user/" + userId + "/header/image";
        console.log("uploading header image");
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken'),
            'Content-Type': 'multipart/form-data'
        };
        axios({method: 'POST', url: url, headers: requestHeaders, data: formData})
            .then(response => {
                dispatch(loadUserHeaderImageSuccess(url + "?" + Date.now()));
            })
            .catch(error => {
                console.log(error);
            })
    }
};
