import { Router } from 'express';
import Thread from './thread';
import { db } from '../init/db';
import Boards from '../models/Boards.model';
import Threads from '../models/Threads.model'; 

const Board = Router();

Board.use('/:board', Thread);

Board.get('/:board', async (req, res) => {
    const board_id = req.params.board;
    const board = await Boards.findOne({ where: { id: board_id } });
    
    if (!board) {
      res
        .status(404)
        .render('error.ejs', { code: 404, message: "Board not found!"})

      return;
    }

    const threads = await Threads.findAll({where: { board_id }})
    res.render('board.ejs', { board_id: board_id, threads: threads })
});

Board.post('/:board', async (req, res) => {
  const board_id = req.params.board;
  const id = req.body.id;
  
  const newThread: any = { id, board_id };
  
  await Threads.create(newThread);
  res.status(200).send("Thread created successfully");
  // await Threads.create({ id, board_id } as Partial<Threads>);

});

export default Board;