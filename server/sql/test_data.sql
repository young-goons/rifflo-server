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
    (2, 4),
    (3, 4),
    (3, 5),
    (4, 6),
    (5, 6);

INSERT INTO tbl_song_info(song_name, artist) VALUES
    ('Animals', 'Maroon 5'),
    ('Photograph', 'Ed Sheeran'),
    ('Hello', 'Adele'),
    ('Heartless', 'Kanye West');

