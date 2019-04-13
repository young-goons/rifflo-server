import hashlib
import os
import binascii

SHA_N_ITERATIONS = 200000

def hash_password(password):
    """
    Hash a password to store in the database.
    Salt produced using SHA256 and hashed using SHA512
    :param password: input password to be hashed
    :return: salt + hashed password (concatenated into one string)
             the first 64 characters (256 bits) is salt and
             the remaining 128 characters (512 bits) is the hashed password
    """
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    password_hash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'),
                                        salt, SHA_N_ITERATIONS)
    password_hash = binascii.hexlify(password_hash)
    return (salt + password_hash).decode('ascii')


def verify_password(stored_password, provided_password):
    """
    Verifies the provided password by calculating its hash and comparing it
    to the stored password.
    :param stored_password: input (hashed) password to be compared
    :param provided_password: correct (hashed) password that is stored
    :return: True if verified, False if not
    """
    salt = stored_password[:64]
    stored_password = stored_password[64:]
    password_hash = hashlib.pbkdf2_hmac('sha512', provided_password.encode('utf-8'),
                                        salt.encode('ascii'), SHA_N_ITERATIONS)
    password_hash = binascii.hexlify(password_hash).decode('ascii')
    return stored_password == password_hash
