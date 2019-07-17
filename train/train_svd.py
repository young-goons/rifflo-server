import pymysql
import random

import ygoons.config as config
from ygoons.modules.user.svd import SVD

NUM_EPOCHS = 10000


def train():
    clf = SVD()

    # Connect to db
    cnx = pymysql.connect(host=config.DB_HOST,
                          port=config.DB_PORT,
                          user=config.DB_USER,
                          password=config.DB_PASSWORD,
                          database=config.DB_NAME)

    def _build_training_dataset():
        with cnx.cursor() as cursor:
            # Get positive training examples
            # TODO: only use recent training data
            sql = "SELECT DISTINCT user_id, post_id, 1 AS rating FROM tbl_like"
            cursor.execute(sql)
            post_likes = list(cursor.fetchall())

            # Get negative training examples
            sql = "SELECT DISTINCT user_id, post_id, -1 AS rating FROM tbl_dislike"
            cursor.execute(sql)
            post_dislikes = list(cursor.fetchall())

            return post_likes + post_dislikes

    training_data = _build_training_dataset()
    clf.db_load(cnx)

    # Train
    for _ in range(NUM_EPOCHS):
        random.shuffle(training_data)
        for (user_id, post_id, rating) in training_data:
            clf.update(user_id, post_id, rating)

    # Save
    clf.db_save(cnx)
