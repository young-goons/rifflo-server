INSERT INTO tbl_user(email, username, password) VALUES 
    ('johnguackmbl@gmail.com', 'johnguackmbl', ''),
    ('1@gmail.com', '1', ''),
    ('2@gmail.com', '2', ''),
    ('3@gmail.com', '3', ''),
    ('4@gmail.com', '4', ''),
    ('5@gmail.com', '5', ''),
    ('6@gmail.com', '6', ''),
    ('7@gmail.com', '7', ''),
    ('8@gmail.com', '8', ''),
    ('9@gmail.com', '9', ''),
    ('10@gmail.com', '10', '');

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

INSERT INTO tbl_song_info(song_name, artist) VALUES
    ('Animals', 'Maroon 5'),
    ('Photograph', 'Ed Sheeran'),
    ('Hello', 'Adele'),
    ('Heartless', 'Kanye West');

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
    clip_start_time, clip_end_time, clip_path, song_path) VALUES
    (1, 1, 1, 0., 0., '', ''),
    (2, 2, 2, 0., 0., '', ''),
    (3, 3, 3, 0., 0., '', ''),
    (4, 4, 4, 0., 0., '', '');

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
