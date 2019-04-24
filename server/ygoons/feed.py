import numpy as np

def select_feed_posts(friend_posts, top_posts, limit=20):
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
    fpop = np.array(list(map(lambda x: x[1], friend_posts)))
    tpop = np.array(list(map(lambda x: x[1], top_posts)))

    # Randomly select candidate posts from friend_posts
    # weighted by popularity
    fposts = list(np.random.choice(fposts, size=min(limit, len(fposts)),
        replace=False, p=fpop/sum(fpop)))
    # Do the same for top_posts
    tposts = list(np.random.choice(tposts, size=min(limit, len(tposts)),
        replace=False, p=tpop/sum(tpop)))

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

    return posts
