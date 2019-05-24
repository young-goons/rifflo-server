import axios from '../../shared/axios';

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

export const loadAuthUserInfo = (userInfo) => {
    return {
        type: actionTypes.LOAD_AUTH_USER_INFO,
        userInfo: userInfo
    };
};

export const loadAuthUser = (user_id) => {
    return dispatch => {
        const url = "/user/" + user_id + "/info";
        axios({method: 'GET', url: url})
            .then(response => {
                dispatch(loadAuthUserInfo(response.data.user));
            })
            .catch(error => {
                console.log(error);
            })
    };
};

export const auth = (email, password) => {
    return dispatch => {
        let url = "/signin";
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
                    url =  "/user/" + response.data.user.user_id + "/info";
                    return axios({method: 'GET', url: url});
                } else {
                    dispatch(wrongPassword());
                    return;
                }
            })
            .then(response => {
                if (response) {
                    dispatch(loadAuthUserInfo(response.data.user));
                    console.log(response.data.user)
                }
            })
            .catch(error => {
                dispatch(authFail(error));
            });
    };
};

export const authFacebook = (accessToken) => {
    return dispatch => {
        let url = "/signin/facebook";
        const headers = {
            'Facebook-Access-Token': accessToken
        };
        axios({method: 'POST', url: url, headers: headers})
            .then(response => {
                if (response.data.user) {
                    window.localStorage.setItem('accessToken', response.data.user.access_token);
                    window.localStorage.setItem('refreshToken', response.data.user.refresh_token);
                    console.log(response);
                    url =  "/user/" + response.data.user.user_id + "/info";
                    return axios({method: 'GET', url: url})
                } else {
                    console.log("Facebook authentication failed");
                    return;
                }
            })
            .then(response => {
                if (response) {
                    dispatch(loadAuthUserInfo(response.data.user));
                    console.log(response.data.user);
                }
            })
            .catch(error => {
                console.log(error);
            })
    };
};


/**
 * Refreshes authentication. Assumes there exists refreshToken in localStorage.
 */
export const authRefresh = (callback) => {
    return dispatch => {
        const url = "/refresh";
        axios({method: 'GET', url: url})
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