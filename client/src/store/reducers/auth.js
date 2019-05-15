import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isAuthenticating: false,
    isAuthenticated: false,
    error: null,
    wrongPassword: false,
    authRedirectPath: '/',
    authUserInfo: null
};

const authSuccess = (state, action) => {
    return {
        ...state,
        isAuthenticated: true,
        error: null,
        wrongPassword: false
    };
};

const authFail = (state, action) => {
    return {
        ...state,
        isAuthenticated: false,
        error: action.error,
        authUserInfo: null
    };
};

const wrongPassword = (state, action) => {
    return {
        ...state,
        wrongPassword: true,
        isAuthenticated: false,
        authUserInfo: null,
    }
};

const setAuthRedirectPath = (state, action) => {
    return {
        ...state,
        authRedirectPath: action.path
    };
};

const signOut = (state, action) => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    return {
        ...state,
        error: action.error,
        isAuthenticating: false,
        isAuthenticated: false,
        authUserInfo: null,
        wrongPassword: null,
        authRedirectPath: '/',
    };
};

// assume user info is loaded only when authentication is successful
const loadAuthUserInfo = (state, action) => {
    return {
        ...state,
        authUserInfo: action.userInfo,
        isAuthenticated: true
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.WRONG_PASSWORD: return wrongPassword(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
        case actionTypes.SIGN_OUT: return signOut(state, action);
        case actionTypes.LOAD_AUTH_USER_INFO: return loadAuthUserInfo(state, action);
        default:
            return state;
    }
};

export default reducer;