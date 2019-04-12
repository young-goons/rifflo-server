import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isFeedLoaded: false,
    feedPostIdArr: [],
    feedPostIdx: 0, // the next post index to be fetched from feedPostIdArr
    error: null
};

const loadFeedSuccess = (state, action) => {
    return {
        ...state,
        isFeedLoaded: true,
        feedPostIdArr: action.feedPostIdArr,
        feedPostIdx: 0,
        error: null
    };
};

const loadFeedFail = (state, action) => {
    return {
        ...state,
        isFeedLoaded: false,
        feedPostIdArr: [],
        feedPostIdx: 0,
        error: action.error
    };
};

const loadFeedPostsSuccess = (state, action) => {
    return {
        ...state,
        feedPostIdx: state.feedPostIdx + action.numPosts,
        error: null
    };
};

const loadFeedPostsFail = (state, action) => {
    return {
        ...state,
        error: action.error
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_FEED_SUCCESS: return loadFeedSuccess(state, action);
        case actionTypes.LOAD_FEED_FAIL: return loadFeedFail(state, action);
        case actionTypes.LOAD_FEED_POSTS_SUCCESS: return loadFeedPostsSuccess(state, action);
        case actionTypes.LOAD_FEED_POSTS_FAIL: return loadFeedPostsFail(state, action);
        default:
            return state;
    }
};

export default reducer;