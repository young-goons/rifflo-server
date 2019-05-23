INSERT INTO tbl_user(user_id, email, username, password) VALUES
    (1, '1@gmail.com', 'user1', ''),
    (2, '2@gmail.com', 'user2', ''),
    (3, '3@gmail.com', 'user3', ''),
    (4, '4@gmail.com', 'user4', ''),
    (5, '5@gmail.com', 'user5', ''),
    (6, '6@gmail.com', 'user6', ''),
    (7, '7@gmail.com', 'user7', ''),
    (8, '8@gmail.com', 'user8', ''),
    (9, '9@gmail.com', 'user9', ''),
    (10, '10@gmail.com', 'user10', ''),
    (11, 'johnguackmbl@gmail.com', 'johnguackmbl', '');

INSERT INTO tbl_user_info(user_id) VALUES
    (1),
    (2),
    (3),
    (4),
    (5),
    (6),
    (7),
    (8),
    (9),
    (10),
    (11);

INSERT INTO tbl_follow(follower_id, followed_id) VALUES
    (1, 2),
    (1, 3),
    (1, 6),
    (1, 7),
    (2, 4),
    (2, 5),
    (2, 8),
    (3, 4),
    (3, 5),
    (4, 6),
    (5, 6),
    (7, 1),
    (8, 2),
    (9, 3);

-- Insert multiple rows separately in order to keep track of song id
INSERT INTO tbl_song_info(song_id, song_name, artist, spotify_url, youtube_url) VALUES
    (1, 'Animals', 'Maroon 5', 'www.spotify.com/1', 'www.youtube.com/1'),
    (2, 'Photograph', 'Ed Sheeran', 'www.spotify.com/2', 'www.youtube.com/2'),
    (3, 'Hello', 'Adele', 'www.spotify.com/3', 'www.youtube.com/3'),
    (4, 'Heartless', 'Kanye West', 'www.spotify.com/4', 'www.youtube.com/4');

INSERT INTO tbl_music_analysis(
    song_id,
    danceability,
    energy,
    loudness,
    acousticness,
    instrumentalness,
    liveness,
    valence) VALUES
    (1, 0.2, 0.4, 0.3, 0.1, 0.5, 0.1, 0.9),
    (2, 0.3, 0.6, 0.2, 0.8, 1.2, -0.8, 0.7),
    (3, 0.2, 0.5, 0.1, 0.7, 1.4, -0.7, 0.4),
    (4, 1.3, 1.6, -0.2, -0.5, -1.9, 0.8, -0.3);

INSERT INTO tbl_post(post_id, user_id, song_id,
    clip_start_time, clip_end_time, clip_path, song_path,
    content, tags) VALUES
    (1, 1, 1, 0., 15., './clip_path1', './song_path1', 'content1', 'tags1'),
    (2, 2, 2, 0., 15., './clip_path2', './song_path2', 'content2', 'tags2'),
    (3, 3, 3, 0., 15., './clip_path3', './song_path3', 'content3', 'tags3'),
    (4, 4, 4, 0., 15., './clip_path4', './song_path4', 'content4', 'tags4'),
    (5, 1, 2, 0., 15., './clip_path5', './song_path5', 'content5', 'tags5');

INSERT INTO tbl_like(post_id, user_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (2, 1),
    (2, 5),
    (2, 6),
    (3, 1),
    (3, 3),
    (3, 4),
    (3, 5),
    (4, 2),
    (4, 6);

INSERT INTO tbl_comment(comment_id, post_id, user_id, comment_date, content) VALUES
    (1, 1, 1, '2019-05-23 00:00:00', 'comment1'),
    (2, 1, 3, '2019-05-23 00:02:00', 'comment2'),
    (4, 1, 5, '2019-05-23 00:03:00', 'comment3');