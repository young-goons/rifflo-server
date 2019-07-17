"""
Write tests with the following format:
    def test_*(tester):
        {return_value} = tester.get(...)

        assert rv.status_code == 200
"""

import pytest

import flask
import pymysql
from ygoons import app

# from ygoons import config # Add testing config, see pinned tab, add default config to push


@pytest.fixture
def tester():
    app.config['SERVER_NAME'] = '127.0.0.1'

    # ctx = app.app_context()
    # ctx.push()

    with app.app_context():
        connection = pymysql.connect(host='localhost',
                                     user='ygoons_test',
                                     passwd='Public1!',
                                     db='ygoons_test')
        flask.g.pymysql_db = connection

        yield app.test_client()

        flask.g.pymysql_db.close()
