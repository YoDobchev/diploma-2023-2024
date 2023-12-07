import { Router } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { db } from '../init/db';
import Boards from '../models/Boards.model';

const home = Router();

home.get('/', async (req, res) => {

    await db.authenticate();
    const boards = await Boards.findAll();
        // const formattedRecords = records.map(record => record.get({ plain: true }));
        // const result = await db.query('SELECT * FROM public.lul;')
        // console.log(result);        

    console.log(JSON.stringify(boards));            
    res.render('home.ejs', {boards: boards});
});

export default home;