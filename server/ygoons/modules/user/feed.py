import numpy as np
import sys
from ygoons.modules.user import svd


def get_feed_suggest(user_id, cnx):
    """Suggest posts on feed.
    Args:
        user_id (int): id of user
        cnx: DB connection
    Returns:
        list: ordered suggestion list of post_ids
    """
    with cnx.cursor() as cursor:
        # obtain the list of ids of the top posts shared by other users for now...
        # TODO: is this limit reasonable
        sql = '''
        SELECT tbl_post.post_id, like_cnt
        FROM tbl_post LEFT JOIN view_like_count
        ON tbl_post.post_id = view_like_count.post_id
        WHERE user_id != %s
        ORDER BY like_cnt DESC
        LIMIT 1000'''
        cursor.execute(sql, (user_id))
        top_posts = cursor.fetchall()

        # obtain list of ids of top posts shared by followed users
        sql = '''
        SELECT tbl_post.post_id, like_cnt
        FROM tbl_post LEFT JOIN view_like_count
        ON tbl_post.post_id = view_like_count.post_id
        WHERE user_id in
            (SELECT followed_id FROM tbl_follow WHERE follower_id = %s)
        ORDER BY like_cnt DESC
        LIMIT 1000'''
        cursor.execute(sql, (user_id))
        friend_posts = cursor.fetchall()

    cand_id_list = _select_popularity(friend_posts=friend_posts,
                                      top_posts=top_posts,
                                      limit=1000)

    # Reorder using SVD features
    clf = svd.SVD()
    clf.db_load_user(cnx, [user_id])
    clf.db_load_post(cnx, cand_id_list)

    post_id_list = clf.get_recommendations(user_id,
                                           k=1000,
                                           candidates=cand_id_list)

    # TODO: introduce shuffling in top posts
    return post_id_list


def _select_popularity(friend_posts=[], top_posts=[], limit=20):
    """Simple feed selection using popularity as a heuristic.
    Args:
        friend_posts (list): List of candidate posts from friends
        top_posts (list): List of candidate global posts
        limit (int): Number of post_ids to return

        Each post is a tuple (post_id, popularity) where popularity
        can be some metric like number of upvotes

    Returns:
        list: List of post_ids for feed (up to limit)
    """
    top_posts_prob = 0.5

    fposts = list(map(lambda x: x[0], friend_posts))
    tposts = list(map(lambda x: x[0], top_posts))
    fpop = np.array(list(map(lambda x: np.exp(x[1]), friend_posts)))
    tpop = np.array(list(map(lambda x: np.exp(x[1]), top_posts)))

    # Randomly select candidate posts from friend_posts
    # exponentially (TODO: is this reasonable) weighted by popularity
    fposts = list(
        np.random.choice(fposts,
                         size=min(limit, len(fposts)),
                         replace=False,
                         p=fpop / sum(fpop))) if fposts else []
    # Do the same for top_posts
    tposts = list(
        np.random.choice(tposts,
                         size=min(limit, len(tposts)),
                         replace=False,
                         p=tpop / sum(tpop))) if tposts else []

    fposts = list(reversed(fposts))
    tposts = list(reversed(tposts))

    # Randomly interleave posts between these candidates using
    # top_post_prob as selection probability
    posts = []
    while len(posts) < limit:
        if len(fposts) > 0 and len(tposts) > 0:
            if np.random.rand() < top_posts_prob:
                # Add a post from top_posts stream to feed
                chosen_post = fposts.pop()
            else:
                chosen_post = tposts.pop()
        elif len(fposts) > 0:
            chosen_post = fposts.pop()
        elif len(tposts) > 0:
            chosen_post = tposts.pop()
        else:
            # Ran out of posts!
            break

        if chosen_post not in posts:
            # Avoid duplicates
            posts.append(chosen_post)

    return list(map(lambda x: int(x), posts))
