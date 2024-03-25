import { Router } from 'express';
import Boards from '../models/Boards.model';

const home = Router();

home.get('/', async (req, res) => {
    const boards = await Boards.findAll();
        // const formattedRecords = records.map(record => record.get({ plain: true }));
        // const result = await db.query('SELECT * FROM public.lul;')
        // console.log(result);        

    console.log(JSON.stringify(boards));            
    res.render('home.ejs', { boards: boards, user: req.session.username });
});

export default home;