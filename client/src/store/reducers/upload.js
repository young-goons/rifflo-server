import * as actionTypes from '../actions/actionTypes';

const initialState = {
    songFile: null,
    clipRange: null,
    songId: null,
    songInfo: null,
    newPostId: null,
    postShareError: null
};

const uploadSong = (state, action) => {
    return {
        ...state,
        songFile: action.songFile,
        clipRange: action.clipRange,
        songId: action.songId,
        songInfo: action.songInfo
    };
};

const postShareSuccess = (state, action) => {
    return {
        ...state,
        songFile: null,
        clipRange: null,
        songId: null,
        songInfo: null,
        newPostId: action.newPostId,
        postShareError: null,
    };
};

const postShareFail = (state, action) => {
    return {
        ...state,
        newPostId: null,
        postShareError: action.error
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPLOAD_SONG: return uploadSong(state, action);
        case actionTypes.SHARE_POST_SUCCESS: return postShareSuccess(state, action);
        case actionTypes.SHARE_POST_FAIL: return postShareFail(state, action);
        default:
            return state;
    }
};

export default reducer;