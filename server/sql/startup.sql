DROP DATABASE IF EXISTS app_dev;
CREATE DATABASE app_dev;
USE app_dev;


-- Create the database schema.
DROP TABLE IF EXISTS tbl_post;
DROP TABLE IF EXISTS tbl_song_info;
DROP TABLE IF EXISTS tbl_user_info;
DROP TABLE IF EXISTS tbl_user;

-- Create user tables.
CREATE TABLE tbl_user
(
    user_id    INT AUTO_INCREMENT,
    email      VARCHAR(50) NOT NULL UNIQUE,
    username   VARCHAR(20) NOT NULL UNIQUE,

    -- first 256 bits (64 characters) correspond to salt
    -- and the remaining 512 bits (128 characters) correspond to the hash
    password   CHAR(192) NOT NULL,

    join_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id)
);

CREATE TABLE tbl_user_info
(
    user_id               INT PRIMARY KEY,
    following_count       INT DEFAULT 0,
    follower_count        INT DEFAULT 0,
    profile_picture_path  VARCHAR(50),

    FOREIGN KEY (user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create song tables.
CREATE TABLE tbl_song_info
(
    song_id       INT AUTO_INCREMENT,
    song_name     VARCHAR(50) NOT NULL,
    artist        VARCHAR(50) NOT NULL,
    release_date  DATE,
    album         VARCHAR(50),

    PRIMARY KEY(song_id)
);

-- Create post tables.
CREATE TABLE tbl_post
(
    post_id        INT AUTO_INCREMENT,
    user_id        INT NOT NULL,
    upload_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content        VARCHAR(100),
    tags           VARCHAR(100),
    song_id        INT NOT NULL,
    clip_path      VARCHAR (50) NOT NULL,
    like_count     INT DEFAULT 0,
    comment_count  INT DEFAULT 0,

    PRIMARY KEY(post_id),

    FOREIGN KEY (user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (song_id) REFERENCES tbl_song_info(song_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);
