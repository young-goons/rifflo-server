# Usage

## App

`python app.py`

## Database

### Setup

1. Download MySQL.
2. Write config.py file
* import datetime
* Default values: DB_HOST='localhost', DB_PORT=3306, DB_USER='root', DB_PASSWORD=[mysql password],
DB_NAME='app_dv', JWT_SECRET_KEY='abcdef', JWT_ACCESS_TOKEN_EXPIRES=datetime.timedelta(days=1)
2. Connect to MySQL server with `mysql -u root -p`.
3. Create and use the database with `SOURCE sql/rifflet.sql`.
4. Insert dummy values to the table `SOURCE sql/data.sql`.
5. References
[Creating a Web App from Scratch Using Flask and MySQL](https://code.tutsplus.com/tutorials/creating-a-web-app-from-scratch-using-python-flask-and-mysql--cms-22972)

# Resources

## Flask

* https://blog.miguelgrinberg.com/post/designing-a-restful-api-with-python-and-flask
* https://codeburst.io/jwt-authorization-in-flask-c63c1acf4eeb

# Authentication

* https://www.vitoshacademy.com/hashing-passwords-in-python/

# To Do

* SQL injection?
* Refactor API endpoints (posts)
* SQLAlchemy instead of raw SQL queries
