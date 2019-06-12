const BANNED_USERNAME_ARR = [
    "help", "people", "contact", "post"
];

const BANNED_CHAR_ARR = [
    "\\", "/", ":", "*", "?", "\"", "<", ">", "|", " "
];

export const validateUsername = (usernameStr) => {
    if (BANNED_USERNAME_ARR.includes(usernameStr)) {
        return {
            valid: false,
            msg: "Input username is a reserved keyword."
        };
    } else {
        let includeIllegalChar = false;
        for (let i = 0; i < usernameStr.length; i++) {
            if (BANNED_CHAR_ARR.includes(usernameStr.charAt(i))) {
                includeIllegalChar = true;
                break;
            }
        }
        if (includeIllegalChar) {
            return {
                valid: false,
                msg: "\\, /, :, *, ?, \", <, >, |, ' ' illegal in username"
            };
        } else {
            return {
                valid: true,
                msg: null
            };
        }
    }
};