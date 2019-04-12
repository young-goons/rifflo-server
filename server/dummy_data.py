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
        'tags': '#cool',
        'like_count': 5
    },
    2: {
        'post_id': 2,
        'user_id': 1,
        'username': 'abc',
        'date': '03.10.2019',
        'content': 'this is post 2',
        'like_count': 2,
        'tags': '#sad, #memories',
    },
    3: {
        'post_id': 3,
        'user_id': 2,
        'username': 'def',
        'date': '02.01.2019',
        'content': 'this is post 3',
        'like_count': 10,
        'tags': '#chill, #summer',
    },
    4: {
        'post_id': 4,
        'user_id': 1,
        'username': 'abc',
        'date': '09.10.2018',
        'content': 'this is post 4',
        'like_count': 3,
        'tags': '#club, #night',
    },
    5: {
        'post_id': 5,
        'user_id': 1,
        'username': 'abc',
        'date': '06.18.2018',
        'content': 'this is post 5',
        'like_count': 1,
        'tags': '#club, #city',
    },
    6: {
        'post_id': 6,
        'user_id': 2,
        'username': 'def',
        'date': '05.01.2018',
        'content': 'this is post 6',
        'like_count': 9,
        'tags': '#fast, #awake',
    },
    7: {
        'post_id': 7,
        'user_id': 2,
        'username': 'def',
        'date': '09.19.2016',
        'content': 'this is post 7',
        'like_count': 11,
        'tags': '',
    },
}

user_feed = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [2]
}

user_posts = {
    1: [2],
    2: [1, 3]
}