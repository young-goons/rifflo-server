import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isAuthenticating: false,
    isAuthenticated: false,
    error: null,
    wrongPassword: false,
    authRedirectPath: '/',
    userInfo: null
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
        userInfo: null
    };
};

const wrongPassword = (state, action) => {
    return {
        ...state,
        wrongPassword: true,
        isAuthenticated: false,
        userInfo: null,
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
        isAuthenticated: false,
        userInfo: null
    };
};

const loadUserInfo = (state, action) => {
    return {
        ...state,
        userInfo: action.userInfo
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.WRONG_PASSWORD: return wrongPassword(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
        case actionTypes.SIGN_OUT: return signOut(state, action);
        case actionTypes.LOAD_USER_INFO: return loadUserInfo(state, action);
        default:
            return state;
    }
};

export default reducer;