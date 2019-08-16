-- TODO: Apply indices

-- Create the database schema.

DROP VIEW IF EXISTS view_like_count;
DROP VIEW IF EXISTS view_comment_count;
DROP VIEW IF EXISTS view_follower_count;
DROP VIEW IF EXISTS view_following_count;

DROP TABLE IF EXISTS tbl_post_report;
DROP TABLE IF EXISTS tbl_user_ignore;
DROP TABLE IF EXISTS tbl_user_svd;
DROP TABLE IF EXISTS tbl_post_svd;
DROP TABLE IF EXISTS tbl_user_bias;
DROP TABLE IF EXISTS tbl_post_bias;
DROP TABLE IF EXISTS tbl_music_analysis;
DROP TABLE IF EXISTS tbl_dislike;
DROP TABLE IF EXISTS tbl_like;
DROP TABLE IF EXISTS tbl_play_history;
DROP TABLE IF EXISTS tbl_play_full_history;
DROP TABLE IF EXISTS tbl_full_song_history;
DROP TABLE IF EXISTS tbl_reply;
DROP TABLE IF EXISTS tbl_comment;
DROP TABLE IF EXISTS tbl_bookmark;
DROP TABLE IF EXISTS tbl_follow;
DROP TABLE IF EXISTS tbl_post;
DROP TABLE IF EXISTS tbl_song_info;
DROP TABLE IF EXISTS tbl_user_info;
DROP TABLE IF EXISTS tbl_user;

CREATE TABLE tbl_user
(
    user_id       VARCHAR(50) PRIMARY KEY,
    email         VARCHAR(50) NOT NULL UNIQUE,
    username      VARCHAR(50) NOT NULL UNIQUE,
    username_set  BOOLEAN DEFAULT FALSE
);

CREATE TABLE tbl_user_info
(
    user_id   VARCHAR(50) PRIMARY KEY,
    name      VARCHAR(50),
    location  VARCHAR(100),

    FOREIGN KEY (user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create song table.
CREATE TABLE tbl_song_info
(
    song_id         INT AUTO_INCREMENT,
    song_name       VARCHAR(900) NOT NULL,
    artist          VARCHAR(300) NOT NULL,
    release_date    DATE,
    album           VARCHAR(50),
    spotify_url     VARCHAR(200),
    applemusic_url  VARCHAR(200),
    youtube_url     VARCHAR(200),
    soundcloud_url  VARCHAR(200),
    bandcamp_url    VARCHAR(200),
    other_url       VARCHAR(200),

    PRIMARY KEY(song_id)
);

-- CREATE TABLE tbl_song_info_history
-- (
--     song_id  INT,
--     date  DATE DEFAULT CURRENT_TIMESTAMP,
--
-- )

-- Create post table.
CREATE TABLE tbl_post
(
    post_id          INT AUTO_INCREMENT,
    user_id          VARCHAR(50) NOT NULL,
    upload_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content          VARCHAR(100),
    tags             VARCHAR(100),
    song_id          INT NOT NULL,
    clip_start_time  FLOAT(5, 2) NOT NULL, -- start time of clip in seconds
    clip_end_time    FLOAT(5, 2) NOT NULL, -- end time of clip in seconds
    clip_path        VARCHAR(200) NOT NULL, -- path to the mp3 of clip
    song_path        VARCHAR(200) NOT NULL, -- path to the mp3 of full song

    PRIMARY KEY(post_id),

    FOREIGN KEY (user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (song_id) REFERENCES tbl_song_info(song_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create follow table.
CREATE TABLE tbl_follow
(
    followed_id  VARCHAR(50),
    follower_id  VARCHAR(50),
    follow_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(followed_id, follower_id),

    FOREIGN KEY (followed_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (follower_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create view that stores the number of followers of each user
CREATE VIEW view_follower_count AS
SELECT user_id, COUNT(follower_id) AS follower_cnt FROM
  tbl_user LEFT JOIN tbl_follow ON user_id = followed_id
  GROUP BY user_id;

-- Create view that stores the number of users each user follows
CREATE VIEW view_following_count AS
SELECT user_id, COUNT(followed_id) AS following_cnt FROM
   tbl_user LEFT JOIN tbl_follow ON user_id = follower_id
   GROUP BY user_id;

-- Create like table.
CREATE TABLE tbl_like
(
    post_id    INT,
    user_id    VARCHAR(50),
    like_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(post_id, user_id),

    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create view that stores like count of each post
CREATE VIEW view_like_count AS
SELECT tbl_post.post_id, COUNT(tbl_like.user_id) AS like_cnt FROM
  tbl_post LEFT JOIN tbl_like ON tbl_post.post_id = tbl_like.post_id
  GROUP BY post_id;

-- Create comment table.
CREATE TABLE tbl_comment
(
    comment_id    INT AUTO_INCREMENT,
    post_id       INT NOT NULL,
    user_id       VARCHAR(50) NOT NULL,
    comment_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content       VARCHAR(100) NOT NULL,
    song_path     VARCHAR(50), -- allow to embed song links (or sth like that) in comment

    PRIMARY KEY(comment_id),

    FOREIGN KEY(post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create view that stores comment count of each post
CREATE VIEW view_comment_count AS
SELECT tbl_post.post_id, COUNT(tbl_comment.user_id) AS comment_cnt FROM
  tbl_post LEFT JOIN tbl_comment ON tbl_post.post_id = tbl_comment.post_id
  GROUP BY post_id;

-- Create reply table
CREATE TABLE tbl_reply
(
    reply_id    INT AUTO_INCREMENT,
    comment_id  INT NOT NULL,
    user_id     VARCHAR(50) NOT NULL,
    content     VARCHAR(100) NOT NULL,
    reply_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(reply_id),

    FOREIGN KEY(comment_id) REFERENCES tbl_comment(comment_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tbl_bookmark
(
    user_id        VARCHAR(50),
    post_id        INT,
    bookmark_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id, post_id),

    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create dislike table
CREATE TABLE tbl_dislike
(
    user_id       VARCHAR(50),
    post_id       INT,
    dislike_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id, post_id),

    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create table that records reporting on a post
CREATE TABLE tbl_post_report
(
    post_id      INT,
    user_id      VARCHAR(50),
    content      VARCHAR(500),
    report_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id, post_id, report_date),

    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create table to record clips that the user clicked play
CREATE TABLE tbl_play_history
(
    user_id    VARCHAR(50),
    post_id    INT,
    play_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id, post_id, play_date),

    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create table to record clips that the user fully played
CREATE TABLE tbl_play_full_history
(
    user_id    VARCHAR(50),
    post_id    INT,
    play_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id, post_id, play_date),

    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create table to record when the user clicks the full song link
CREATE TABLE tbl_full_song_history
(
    user_id       VARCHAR(50),
    post_id       INT,
    service_type  VARCHAR(15), -- 'youtube', 'spotify', 'soundcloud', 'bandcamp'
    listen_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id, post_id, listen_date),

    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create user stop history table (songs that user did not hear until the end)

-- Create table to record user's ignoring other users in user suggestion
CREATE TABLE tbl_user_ignore
(
    user_id          VARCHAR(50),
    ignored_user_id  VARCHAR(50),
    ignore_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id, ignored_user_id),

    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(ignored_user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tbl_user_svd
(
    user_id     VARCHAR(50),
    latent_idx  INT,
    value       DOUBLE,

    PRIMARY KEY(user_id, latent_idx),

    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tbl_post_svd
(
    post_id INT,
    latent_idx INT,
    value DOUBLE,

    PRIMARY KEY(post_id, latent_idx),

    FOREIGN KEY(post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tbl_user_bias
(
    user_id    VARCHAR(50),
    user_bias  DOUBLE,

    PRIMARY KEY(user_id),

    FOREIGN KEY(user_id) REFERENCES tbl_user(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tbl_post_bias
(
    post_id INT,
    post_bias DOUBLE,

    PRIMARY KEY(post_id),

    FOREIGN KEY(post_id) REFERENCES tbl_post(post_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tbl_music_analysis
(
    song_id INT,
    danceability DOUBLE,
    energy DOUBLE,
    loudness DOUBLE,
    acousticness DOUBLE,
    instrumentalness DOUBLE,
    liveness DOUBLE,
    valence DOUBLE,

    PRIMARY KEY(song_id),

    FOREIGN KEY (song_id) REFERENCES tbl_song_info(song_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);
