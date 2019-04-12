// action types for auth reducers
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const SET_AUTH_REDIRECT_PATH = 'SET_AUTH_REDIRECT_PATH';
export const SIGN_OUT = 'SIGN_OUT';
export const LOAD_USER_INFO = 'LOAD_USER_INFO';

// action types for feed reducers
export const LOAD_FEED_SUCCESS = 'LOAD_FEED_SUCCESS'; // load ids of posts not the actual posts
export const LOAD_FEED_FAIL = 'LOAD_FEED_FAIL';
export const LOAD_FEED_POSTS_SUCCESS = 'LOAD_FEED_POSTS_SUCCESS'; // load the actual posts of feed
export const LOAD_FEED_POSTS_FAIL = 'LOAD_FEED_POSTS_FAIL';