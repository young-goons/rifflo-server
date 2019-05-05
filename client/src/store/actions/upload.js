import axios from 'axios';

import * as actionTypes from './actionTypes';

export const uploadSongSuccess = (songFile, clipRange, songInfo) => {
    return {
        type: actionTypes.UPLOAD_SONG_SUCCESS,
        songFile: songFile,
        clipRange: clipRange,
        songInfo: songInfo
    };
};

export const uploadSongFail = (error) => {
    return {
        type: actionTypes.UPLOAD_SONG_FAIL,
        songUploadError: error
    };
};

export const postShareSuccess = (postContent, tags) => {
    return {
        type: actionTypes.POST_SHARE_SUCCESS,
        postContent: postContent,
        tags: tags
    };
};

export const postShareFail = (error) => {
    return {
        type: actionTypes.POST_SHARE_FAIL,
        postShareError: error
    };
};

export const uploadSong = (songFile, clipRange, songInfo) => {
    return dispatch => {

    };
};

export const postUpload = (songFile, clipRange, songInfo, postContent, tags) => {
    return dispatch => {

    };
};

