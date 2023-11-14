CREATE DATABASE diplomna_be;

CREATE ROLE dpbe_user WITH LOGIN PASSWORD 'random_password' CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE diplomna_be TO dpbe_user;

CREATE ROLE dpbe_readonly WITH LOGIN PASSWORD 'other_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO dpbe_readonly;
ALTER ROLE dpbe_readonly SET statement_timeout = '2s';
