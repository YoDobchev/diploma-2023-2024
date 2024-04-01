import { Sequelize } from 'sequelize-typescript';
import Boards from '../models/Boards.model';
import Threads from '../models/Threads.model';
import Posts from '../models/Posts.model';
import Images from '../models/Images.model';
import Users from '../models/Users.model';

export const db = new Sequelize({
    database: process.env.DB,
    dialect: 'postgres',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    benchmark: true,
});

db.addModels([
    Boards,
    Threads,
    Posts,
    Images,
    Users,
]);
