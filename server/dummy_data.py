users = {
    1: {
        'user_id': 1,
        'email': 'abc@gmail.com',
        'username': 'abc',
        'password': '123',
        'birthday': 'YYYY.MM.DD'
    },
    2: {
        'user_id': 2,
        'email': 'def@gmail.com',
        'username': 'def',
        'password': '123',
        'birthday': 'YYYY.MM.DD'
    }
}

posts = {
    1: {
        'post_id': 1,
        'user_id': 2,
        'username': 'def',
        'date': '04.08.2019',
        'content': 'this is post 1',
        'like_count': 5
    },
    2: {
        'post_id': 2,
        'user_id': 1,
        'username': 'abc',
        'date': '03.10.2019',
        'content': 'this is post 2',
        'like_count': 2
    },
    3: {
        'post_id': 3,
        'user_id': 2,
        'username': 'def',
        'date': '02.01.2019',
        'content': 'this is post 3',
        'like_count': 10
    }
}

user_feed = {
    1: [1, 3],
    2: [2]
}

user_posts = {
    1: [2],
    2: [1, 3]
}