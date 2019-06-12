BANNED_USERNAME_SET = {"help", "people", "contact", "post"}

BANNED_CHAR_SET = {"\\", "/", ":", "*", "?", "\"", "<", ">", "|", " "}


def validate_username(username):
    """ Validate input usernmae """
    if username in BANNED_USERNAME_SET:
        return False
    else:
        username_valid = True
        for char in username:
            if char in BANNED_CHAR_SET:
                username_valid = False
                break
        return username_valid
