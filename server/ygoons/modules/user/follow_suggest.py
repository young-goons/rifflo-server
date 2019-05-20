"""
Functions for getting suggested users to follow.
"""


def get_suggest_follow(user_id, cnx):
    """Suggest users to follow.
    Args:
        user_id (int): id of user
        cnx: DB connection
    Returns:
        list: ordered suggestion list of user_ids
    """
    return _get_degree_2(user_id, cnx)


def _get_degree_2(user_id, cnx):
    """Get all users of degree 2 follow that are not currently followed.
    Example:
        this user (follows) user B (follows) user B
        AND user (does NOT follow) user B
        means that user B will be in the list
    Args:
        user_id (int): id of user
        cnx: DB connection
    Returns:
        list: list of user_ids
    """
    sql = '''
    WITH tmp_suggest (followed_id) AS
        (
            SELECT b.followed_id AS followed_ID
            FROM
                tbl_follow a INNER JOIN tbl_follow b
                ON a.followed_id = b.follower_id
            WHERE a.follower_id = %s
            AND b.followed_id NOT IN
                (SELECT followed_id FROM tbl_follow WHERE follower_id = %s)
        )
    SELECT followed_id, COUNT(*) AS num_mutual FROM tmp_suggest
    GROUP BY followed_id
    ORDER BY num_mutual DESC
    ''' % (user_id, user_id)
    with cnx.cursor() as cursor:
        cursor.execute(sql)
        res = cursor.fetchall()
    return list(map(lambda x: x[0], res))
