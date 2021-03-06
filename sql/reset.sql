/*
 * This script resets the test database to a consistent state
 * and should be run at the beginning of each integration test.
 */

DROP DATABASE IF EXISTS ygoons_test;
CREATE DATABASE ygoons_test;
USE ygoons_test;

SET NAMES utf8mb4;
ALTER DATABASE ygoons_test CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Create the database schema.
SOURCE sql/rifflo.sql

-- Populate with test data.
SOURCE sql/test_data.sql
