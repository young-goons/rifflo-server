import axios from '../../shared/axios';

import * as actionTypes from './actionTypes';

export const uploadSong = (songFile, clipRange, songId, songInfo) => {
    return {
        type: actionTypes.UPLOAD_SONG,
        songFile: songFile,
        clipRange: clipRange,
        songInfo: songInfo,
        songId: songId
    };
};

export const postShareSuccess = (postId) => {
    return {
        type: actionTypes.SHARE_POST_SUCCESS,
        newPostId: postId
    };
};

export const postShareFail = (error) => {
    return {
        type: actionTypes.SHARE_POST_FAIL,
        postShareError: error
    };
};

export const sharePost = (songFile, clipRange, songId, songInfo, content, tags) => {
    return dispatch => {
        let url = "/post";
        let formData = new FormData();
        formData.append('songFile', songFile);
        formData.append('track', songInfo['track']);
        formData.append('artist', songInfo['artist']);
        formData.append('album', songInfo['album']);
        formData.append('date', songInfo['releaseDate']);
        formData.append('spotifyUrl', songInfo['spotifyUrl']);
        formData.append('youtubeUrl', songInfo['youtubeUrl']);
        formData.append('applemusicUrl', songInfo['applemusicUrl']);
        formData.append('soundcloudUrl', songInfo['soundcloudUrl']);
        formData.append('bandcampUrl', songInfo['bandcampUrl']);
        formData.append('clipStart', clipRange['startTime']);
        formData.append('clipEnd', clipRange['endTime']);
        formData.append('content', content);
        formData.append('tags', tags);
        const params = {
            songId: songId
        };
        const requestHeaders = {
            'Content-Type': 'multipart/form-data'
        };
        let newPostId;
        axios({method: 'POST', url: url, data: formData, headers: requestHeaders, params: params})
            .then(response => {
                newPostId = response.data.postId;
                dispatch(postShareSuccess(newPostId));
            })
            .catch(error => {
                console.log(error);
                dispatch(postShareFail(error));
            });
    };
};
