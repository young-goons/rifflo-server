update-packages:
	pip install --upgrade pip
	pip install -r requirements.txt

update-reqs:
	pip freeze > requirements.txt

lint:
	yapf -i -r .

test: init-test-db
	pytest .

init-test-db:
	mysql -u ygoons_test --password=Public1! < sql/reset.sql

push: lint test
