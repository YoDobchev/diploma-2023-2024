# Graduation project 2023/2024 | VHSE Djon Atanasov

## Setup


Install npm packages
``` 
$ npm i 
```

Setup postgres
```
CREATE DATABASE diplomna_be;
$ psql -U postgres -d diplomna_be -f dump.sql
CREATE ROLE dpbe_user WITH LOGIN PASSWORD 'random_password' CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE diplomna_be TO dpbe_user;
```
Run
```
$ npm run dev
```