import { Router } from 'express';
import Boards from '../models/Boards.model';
import { deleteBoard } from '../functions/common';

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

  res.status(200).send("Board created successfully");
});

home.delete('/', async (req, res) => {
  const { boardId } = req.body;
  const username = req.session.username;
  console.log(boardId)
  try {
    await deleteBoard(boardId, username);
  } catch(err) {
    console.log(err);
  }
  res.status(200).send();
});

export default home;
