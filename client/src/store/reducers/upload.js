import * as actionTypes from '../actions/actionTypes';

const initialState = {
    songFile: null,
    clipRange: null,
    songInfo: null,
    songUploadError: null,
    postContent: null,
    tags: null,
    postShareError: null
};

const uploadSongSuccess = (state, action) => {
    return {
        ...state,
        songFile: action.songFile,
        clipRange: action.clipRange,
        songInfo: action.songInfo,
        songUploadError: null
    };
};

const uploadSongFail = (state, action) => {
    return {
        ...state,
        clipRange: null,
        songFile: null,
        songInfo: null,
        songUploadError: action.error
    };
};

const postShareSuccess = (state, action) => {
    return {
        ...state,
    };
};

const postShareFail = (state, action) => {
    return {
        ...state,
        postContent: null,
        tags: null,
        postShareError: action.error
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPLOAD_SONG_SUCCESS: return uploadSongSuccess(state, action);
        case actionTypes.UPLOAD_SONG_FAIL: return uploadSongFail(state, action);
        case actionTypes.POST_SHARE_SUCCESS: return postShareSuccess(state, action);
        case actionTypes.POST_SHARE_FAIL: return postShareFail(state, action);
        default:
            return state;
    }
};

export default reducer;