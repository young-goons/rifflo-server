import * as actionTypes from '../actions/actionTypes';

const initialState = {
    postArr: null,
    postLoaded: false,
    error: null,
    profileImgSrc: null
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
        postArr: null,
        postLoaded: false,
        error: action.error
    };
};

const loadUserProfileImageSuccess = (state, action) => {
    return {
        ...state,
        profileImgSrc: action.profileImgSrc
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_USER_POSTS_SUCCESS: return loadUserPostsSuccess(state, action);
        case actionTypes.LOAD_FEED_POSTS_FAIL: return loadUserPostsFail(state, action);
        case actionTypes.LOAD_USER_PROFILE_IMAGE_SUCCESS: return loadUserProfileImageSuccess(state, action);
        default:
            return state;
    }
};

export default reducer;