# Usage

Execute `run.py` to start the server

# Resources

## Flask

* https://blog.miguelgrinberg.com/post/designing-a-restful-api-with-python-and-flask
* https://codeburst.io/jwt-authorization-in-flask-c63c1acf4eeb

# Authentication

* https://www.vitoshacademy.com/hashing-passwords-in-python/

# Makefile

* make update-packages: update virtual environment
* make update-reqs: update requirements.txt
* make lint: style formatting
* make test: initialize test database, run pytest

# Set up test database

1. Log in to MySQL as root: `mysql -u root -p`
2. SOURCE sql/setup.sql;
3. SOURCE sql/reset.sql;
4. `make test` from the terminal to make sure everything works.

# Testing

* Implement tests in tests/modules/{module_name}. Declare test functions as 
  test_{function_name}(tester), where tester is in ygoons.testing.fixtures 
  and initializes the database connection.

# TODOs

* check if same username and email exists
