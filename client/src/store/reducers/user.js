import * as actionTypes from '../actions/actionTypes';

const initialState = {
    postArr: [],
    postLoaded: false,
    error: null
};

const loadUserPostsSuccess = (state, action) => {
    return {
        ...state,
        postArr: action.postArr,
        postLoaded: true,
        error: null
    };
};

const loadUserPostsFail = (state, action) => {
    return {
        ...state,
        postArr: [],
        postLoaded: false,
        error: action.error
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_USER_POSTS_SUCCESS: return loadUserPostsSuccess(state, action);
        case actionTypes.LOAD_FEED_POSTS_FAIL: return loadUserPostsFail(state, action);
        default:
            return state;
    }
};

export default reducer;