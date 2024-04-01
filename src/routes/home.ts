import { Router } from 'express';
import Boards from '../models/Boards.model';

const home = Router();

home.get('/', async (req, res) => {
    const boards = await Boards.findAll();
    res.render('home.ejs', { boards: boards, user: req.session.username });
});

export default home;