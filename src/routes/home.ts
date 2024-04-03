import { Router } from 'express';
import Boards from '../models/Boards.model';

const home = Router();

home.get('/', async (req, res) => {
    const boards = await Boards.findAll();
    res.render('home.ejs', { boards: boards, user: req.session.username });
});

home.post('/', async (req, res) => {
    const { title, description }= req.body;
  
    const newBoard: any = {
      id: title, 
      description: description,
    };
  
    await Boards.create(newBoard);
  
    res.status(200).send("Thread created successfully");
  });

export default home;