import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authSuccess = (accessToken, refreshToken) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const wrongPassword = () => {
    return {
        type: actionTypes.WRONG_PASSWORD,
    }
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const signOut = (error) => {
    return {
        type: actionTypes.SIGN_OUT,
        error: error
    };
};

export const loadUserInfo = (userInfo) => {
    return {
        type: actionTypes.LOAD_USER_INFO,
        userInfo: userInfo
    };
};

export const loadUser = (user_id) => {
    return dispatch => {
        const url = "http://127.0.0.1:5000/user/" + user_id + "/info";
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        axios({method: 'GET', url: url, headers: headers})
            .then(response => {
                dispatch(loadUserInfo(response.data.user));
                console.log("User " + user_id + " loaded");
            })
            .catch(error => {
                alert(error);
            })
    };
};

export const auth = (email, password) => {
    return dispatch => {
        let url = "http://127.0.0.1:5000/signin";
        const user = {
            email: email,
            password: password
        };
        axios({method: 'POST', url: url, params: user})
            .then(response => {
                if (response.data.user) {
                    window.localStorage.setItem('accessToken', response.data.user.access_token);
                    window.localStorage.setItem('refreshToken', response.data.user.refresh_token);
                    console.log(response);
                    url =  "http://127.0.0.1:5000/user/" + response.data.user.user_id + "/info";
                    const headers = {
                        'Authorization': 'Bearer ' + response.data.user.access_token
                    };
                    return axios({method: 'GET', url: url, headers: headers});
                } else {
                    dispatch(wrongPassword());
                    return;
                }
            })
            .then(response => {
                if (response) {
                    dispatch(loadUserInfo(response.data.user));
                    // dispatch(authSuccess());
                    console.log(response.data.user)
                }
            })
            .catch(error => {
                dispatch(authFail(error));
            })
    };
};

/**
 * Refreshes authentication. Assumes there exists refreshToken in localStorage.
 */
export const authRefresh = (callback) => {
    return dispatch => {
        const url = "http://127.0.0.1:5000/refresh";
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('refreshToken')
        };
        axios({method: 'GET', url: url, headers: headers})
            .then(response => {
                window.localStorage.setItem('accessToken', response.data.access_token)
                dispatch(authSuccess());
                callback();
            })
            .catch(error => {
                console.log(error);
            })
    }
};