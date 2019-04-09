import * as actionTypes from './actionTypes';

export const authSuccess = () => {
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

export const auth = (email, password) => {
    return dispatch => {
        // authenticate using axios
    };
};

export const signOut = () => {
    return dispatch => {
        // signout using axios
    };
};