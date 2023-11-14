import { Sequelize } from 'sequelize-typescript';
import Lul from '../models/lul.model';

export const db = new Sequelize({
    database: 'lol',
    dialect: 'postgres',
    username: process.env.USER,
    password: process.env.PASSWORD,
});

db.addModels([
    Lul
]);