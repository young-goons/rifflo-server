"""
SVD for user-post recommendation.
"""

import numpy as np

N_FACTORS = 40
INIT_MEAN = 0
INIT_STD_DEV = 0.1
LRATE = 0.001


class SVD:
    def __init__(self):
        self.user_vecs = {}
        self.post_vecs = {}
        self.user_bias = {}
        self.post_bias = {}

    def db_load(self, connection):
        """Load latent vectors from database.
        Args:
            connection: MySQL connection.
        """
        with connection.cursor() as cursor:
            # Load user and post vectors
            sql = 'SELECT * FROM tbl_user_svd'
            cursor.execute(sql)
            user_query = cursor.fetchall()
            sql = 'SELECT * FROM tbl_post_svd'
            cursor.execute(sql)
            post_query = cursor.fetchall()
            # Load user and post biases
            sql = 'SELECT * FROM tbl_user_bias'
            cursor.execute(sql)
            user_bias_query = cursor.fetchall()
            sql = 'SELECT * FROM tbl_post_bias'
            cursor.execute(sql)
            post_bias_query = cursor.fetchall()

        for (user_id, latent_idx, value) in user_query:
            if user_id not in self.user_vecs:
                self.user_vecs[user_id] = np.zeros(N_FACTORS)
            self.user_vecs[user_id][latent_idx] = value

        for (post_id, latent_idx, value) in post_query:
            if post_id not in self.post_vecs:
                self.post_vecs[post_id] = np.zeros(N_FACTORS)
            self.post_vecs[post_id][latent_idx] = value

        for (user_id, user_bias) in user_bias_query:
            self.set_user_bias(user_id, user_bias)
        for (post_id, post_bias) in post_bias_query:
            self.set_post_bias(post_id, post_bias)

    def db_load_user(self, connection, user_ids):
        """Load latent vectors of users from database.
        Args:
            connection: MySQL connection.
            user_ids (list): list of users to fetch SVD from database
        """
        if not user_ids:
            return
        with connection.cursor() as cursor:
            user_tmp = ', '.join(list(map(str, user_ids)))
            sql = 'SELECT * FROM tbl_user_svd WHERE user_id in (%s)' % user_tmp
            cursor.execute(sql)
            user_query = cursor.fetchall()
            sql = 'SELECT * FROM tbl_user_bias WHERE user_id in (%s)' % user_tmp
            cursor.execute(sql)
            bias_query = cursor.fetchall()

        for (user_id, latent_idx, value) in user_query:
            if user_id not in self.user_vecs:
                self.user_vecs[user_id] = np.zeros(N_FACTORS)
            self.user_vecs[user_id][latent_idx] = value

        for (user_id, user_bias) in bias_query:
            self.set_user_bias(user_id, user_bias)

    def db_load_post(self, connection, post_ids):
        """Load latent vectors from of posts from database.
        Args:
            connection: MySQL connection.
            post_ids (list): list of posts to fetch SVD from database
        """
        if not post_ids:
            return
        with connection.cursor() as cursor:
            post_tmp = ', '.join(list(map(str, post_ids)))
            sql = 'SELECT * FROM tbl_post_svd WHERE post_id in (%s)' % post_tmp
            cursor.execute(sql)
            post_query = cursor.fetchall()
            sql = 'SELECT * FROM tbl_post_bias WHERE post_id in (%s)' % post_tmp
            cursor.execute(sql)
            bias_query = cursor.fetchall()

        for (post_id, latent_idx, value) in post_query:
            if post_id not in self.post_vecs:
                self.post_vecs[post_id] = np.zeros(N_FACTORS)
            self.post_vecs[post_id][latent_idx] = value

        for (post_id, post_bias) in bias_query:
            self.set_post_bias(post_id, post_bias)

    def db_save(self, connection):
        """Save latent vectors to database.
        Args:
            connection: MySQL connection.
        """
        with connection.cursor() as cursor:
            # Delete all old values from user svd table
            # TODO: Very unsafe! Eventually, want a safer way of doing this
            cursor.execute('DELETE FROM tbl_user_svd')
            for user_id in self.user_vecs:
                for i in range(N_FACTORS):
                    sql = '''
                    INSERT INTO tbl_user_svd (user_id, latent_idx, value)
                    VALUES (%s, %s, %s)
                    '''
                    cursor.execute(
                        sql,
                        (user_id, i, float(self.get_user_vector(user_id)[i])))
            # Now post svd table
            cursor.execute('DELETE FROM tbl_post_svd')
            for post_id in self.post_vecs:
                for i in range(N_FACTORS):
                    sql = '''
                    INSERT INTO tbl_post_svd (post_id, latent_idx, value)
                    VALUES (%s, %s, %s)
                    '''
                    cursor.execute(
                        sql,
                        (post_id, i, float(self.get_post_vector(post_id)[i])))

            # User bias
            cursor.execute('DELETE FROM tbl_user_bias')
            for user_id in self.user_vecs:
                sql = '''
                INSERT INTO tbl_user_bias (user_id, user_bias)
                VALUES (%s, %s)
                '''
                cursor.execute(sql, (user_id, float(self.get_user_bias(user_id))))

            # Post bias
            cursor.execute('DELETE FROM tbl_post_bias')
            for post_id in self.post_vecs:
                sql = '''
                INSERT INTO tbl_post_bias (post_id, post_bias)
                VALUES (%s, %s)
                '''
                cursor.execute(sql, (post_id, float(self.get_post_bias(post_id))))

        # Commit changes
        connection.commit()

    def get_user_vector(self, user_id):
        """Get user latent vector.
        Args:
            user_id (int): user ID

        Returns:
            np.array: user latent vector (N_FACTORS,)
        """
        try:
            return self.user_vecs[user_id]
        except KeyError:
            # Return random new latent vector
            # TODO does this design choice make sense?
            return INIT_STD_DEV * np.random.randn(N_FACTORS) + INIT_MEAN

    def get_user_bias(self, user_id):
        """Get user bias.
        Args:
            user_id (int): user ID

        Returns:
            double: user bias
        """
        try:
            return self.user_bias[user_id]
        except KeyError:
            # Return starting bias
            return 0.

    def set_user_vector(self, user_id, uvec):
        """Set user latent vector.
        Args:
            user_id (int): user ID
            uvec (np.array): user latent vector
        """
        self.user_vecs[user_id] = uvec

    def set_user_bias(self, user_id, ubias):
        """Set user bias.
        Args:
            user_id (int): user ID
            ubias (double): user bias
        """
        self.user_bias[user_id] = ubias

    def get_post_vector(self, post_id):
        """Get post latent vector.
        Args:
            post_id (int): post ID

        Returns:
            np.array: post latent vector (N_FACTORS,)
        """
        try:
            return self.post_vecs[post_id]
        except KeyError:
            # Return random new latent vector
            return INIT_STD_DEV * np.random.randn(N_FACTORS) + INIT_MEAN

    def get_post_bias(self, post_id):
        """Get post bias.
        Args:
            post_id (int): post ID

        Returns:
            double: post bias
        """
        try:
            return self.post_bias[post_id]
        except KeyError:
            # Return starting bias
            return 0.

    def set_post_bias(self, post_id, ibias):
        """Set post bias.
        Args:
            post_id (int): post ID
            ibias (double): post bias
        """
        self.post_bias[post_id] = ibias

    def set_post_vector(self, post_id, ivec):
        """Set post latent vector.
        Args:
            post_id (int): post ID
            ivec (np.array): post latent vector
        """
        self.post_vecs[post_id] = ivec

    def set_mean(self, global_mean):
        self.global_mean = global_mean

    def predict(self, user_id, post_id):
        """Predict the rating of an interaction.
        Args:
            user_id (int): user ID
            post_id (int): post ID
        Returns:
            double: predicted user/post interaction rating
        """
        uvec = self.get_user_vector(user_id)
        pvec = self.get_post_vector(post_id)
        ubias = self.get_user_bias(user_id)
        pbias = self.get_post_bias(post_id)
        return np.dot(uvec, pvec) + ubias + pbias

    def update(self, user_id, post_id, rating):
        """Update the latent vectors given a training example.
        Args:
            user_id (int): user ID
            post_id (int): post ID
            rating (double): user/post interaction rating
        """

        err = LRATE * (rating - self.predict(user_id, post_id))

        # Update latent vectors
        uvec = self.get_user_vector(user_id)
        ivec = self.get_post_vector(post_id)
        tmp = uvec  # Synchronous update

        self.set_user_vector(user_id, uvec + err * ivec)
        self.set_post_vector(post_id, ivec + err * tmp)

        # Update user/post biases
        ubias = self.get_user_bias(user_id)
        ibias = self.get_post_bias(post_id)
        self.set_user_bias(user_id, ubias + err)
        self.set_post_bias(post_id, ibias + err)

    def get_error(self, user_id, post_id, rating):
        """Get squared error of prediction.
        Args:
            user_id (int): user ID
            post_id (int): post ID
            rating (double): user/post interaction
        Returns:
            double: squared prediction error
        """
        return np.power(rating - self.predict(user_id, post_id), 2)

    def get_recommendations(self,
                            user_id,
                            k=10,
                            candidates=None,
                            prohibited=None):
        """Get recommendations for a user.
        Args:
            user_id (int): user ID
            k (int): Number of posts to return.
            candidates (list): List of candidates to draw recommendations from.
            prohibited (list): List of prohibited candidates
        Returns:
            list: up to k posts recommended for this user
        """
        post_preds = []
        if candidates is None:
            candidates = self.post_vecs
        for post_id in candidates:
            if prohibited and post_id in prohibited:
                # Don't recommend prohibited posts
                continue
            pred = self.predict(user_id, post_id)
            post_preds.append((post_id, pred))

        sorted_cand = sorted(post_preds, key=lambda x: x[1], reverse=True)
        return list(map(lambda x: x[0], sorted_cand))[:min(len(post_preds), k)]
