// action types for auth reducers
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const WRONG_PASSWORD = 'WRONG_PASSWORD';
export const SET_AUTH_REDIRECT_PATH = 'SET_AUTH_REDIRECT_PATH';
export const SIGN_OUT = 'SIGN_OUT';
export const LOAD_AUTH_USER_INFO = 'LOAD_AUTH_USER_INFO';

// action types for feed reducers
export const LOAD_FEED_SUCCESS = 'LOAD_FEED_SUCCESS'; // load ids of posts not the actual posts
export const LOAD_FEED_FAIL = 'LOAD_FEED_FAIL';
export const LOAD_FEED_POSTS_SUCCESS = 'LOAD_FEED_POSTS_SUCCESS'; // load the actual posts of feed
export const LOAD_FEED_POSTS_FAIL = 'LOAD_FEED_POSTS_FAIL';

// action types for uploading posts (postContent, tags, and song)
export const UPLOAD_SONG = 'UPLOAD_SONG';
export const SHARE_POST_SUCCESS = 'SHARE_POST_SUCCESS';
export const SHARE_POST_FAIL = 'SHARE_POST_FAIL';

// action types for user page on loading posts
// postArr needs to be shared with the post editor
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAIL = 'LOAD_USER_POSTS_FAIL';
export const LOAD_USER_INFO = 'LOAD_USER_INFO';

// action types to load users' images
export const LOAD_USER_PROFILE_IMAGE_SUCCESS = 'LOAD_USER_PROFILE_IMAGE_SUCCESS';
export const LOAD_USER_PROFILE_IMAGE_FAIL = 'LOAD_USER_PROFILE_IMAGE_FAIL';
export const LOAD_USER_HEADER_IMAGE_SUCCESS = 'LOAD_USER_HEADER_IMAGE_SUCCESS';
export const LOAD_USER_HEADER_IMAGE_FAIL = 'LOAD_USER_HEADER_IMAGE_FAIL';
export const DELETE_USER_PROFILE_IMAGE_SUCCESS = 'DELETE_USER_PROFILE_IMAGE_SUCCESS';
export const DELETE_USER_HEADER_IMAGE_SUCCESS = 'DELETE_USER_HEADER_IMAGE_SUCCESS';

// reset users upon sign out
export const RESET_USER = 'RESET_USER';