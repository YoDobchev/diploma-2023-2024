Това ръководство очаква да имате PostgreSQL и NodeJS инсталирани

1. Копирайте проекта в папка
2. Отворете powershell в съответната папка
3. Инсталирайте npm пакети
npm install
4. Създайте база данни
psql -U postgres -c "CREATE DATABASE diplomna_be"
5. Приложете PostgreSQL dump файла
psql -U postgres -d diplomna_be -f dump.sql
6. Влезте с psql в профил postgres
psql -U postgres -h localhost
7. Създайте user и го удостоверете с привилегии
CREATE ROLE dpbe_user WITH LOGIN PASSWORD 'random_password' CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE diplomna_be TO dpbe_user;
8. Излесте от psql
\q
9. В .env заменете ROOTDIR с вашата локална папка
10. Пуснете приложението
npm run dev