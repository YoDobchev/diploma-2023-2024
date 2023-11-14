import { Router } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { db } from '../init/db';
import Lul from '../models/lul.model';

// import lul from '../models/lul.model';


const home = Router();

home.get('/', async (req, res) => {

    // try {
        await db.authenticate();
        const records = await Lul.findAll();
        const formattedRecords = records.map(record => record.get({ plain: true }));
        // const result = await db.query('SELECT * FROM public.lul;')
        // console.log(result);        

        console.log(JSON.stringify(records));
        // await db.close();
        
    // } catch (error) {
    //     console.error('Database connection error:', error);
    //     return res.status(500).send('Internal Server Error');
    // }


    res.render('home.ejs', {shekels: formattedRecords});
});

export default home;