export const parseJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
};

/**
 * Validates the input jwt access token.
 * Returns True if valid, False if not.
 * @param token Access token to validate
 */
export const validateAccessToken = (token) => {
    if (token) {
        const jwtInfo = parseJWT(token);
        if (Date.now() / 1000 < jwtInfo.exp) {
            return jwtInfo.identity.userId;
        }
    }
    return null;
};
