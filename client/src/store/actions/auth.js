import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authSuccess = (accessToken, refreshToken) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        accessToken: accessToken,
        refreshToken: refreshToken
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
                    dispatch(authSuccess(response.data.user.access_token, response.data.user.refresh_token));
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
                    console.log(response.data.user)
                }
            })
            .catch(error => {
                dispatch(authFail(error));
            })
    };
};