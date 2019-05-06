/*
 * This script resets the test database to a consistent state
 * and should be run at the beginning of each integration test.
 */

DROP DATABASE IF EXISTS ygoons_test;
CREATE DATABASE ygoons_test;
USE ygoons_test;

-- Create the database schema.
SOURCE sql/rifflet.sql

-- Populate with test data.
SOURCE sql/test_data.sql
