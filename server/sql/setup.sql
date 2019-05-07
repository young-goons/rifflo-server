/*
 * This script sets up the test database for the first time. It is run by 
 * Travis at the beginning of each test run.
 * 
 * This script must be run by the root account.
 */

CREATE USER 'ygoons_test'@'localhost' IDENTIFIED BY 'Public1!';
GRANT ALL PRIVILEGES ON ygoons_test.* TO 'ygoons_test'@'localhost';
