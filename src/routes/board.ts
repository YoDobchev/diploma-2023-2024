import { Router } from 'express';
import Thread from './thread';
import Boards from '../models/Boards.model';
import Threads from '../models/Threads.model'; 
import { deleteThread, findThreads } from '../functions/common';
const Board = Router();

Board.use('/:board', Thread);

Board.get('/:board', async (req, res) => {
    const board_id = req.params.board;
    const board = await Boards.findOne({ where: { id: board_id } });

    if (!board) {
      return res
        .status(404)
        .render('error.ejs', { code: 404, message: 'Board not found!', link: '/'})
    }
    const threads = await findThreads(board_id);
    res.render('board.ejs', { board: board_id, threads: threads, user: req.session.username })
});

Board.post('/:board', async (req, res) => {
  const board = req.params.board;
  const { threadId, title, description }= req.body;

  const newThread: any = {
    id: threadId, 
    board_id: board, 
    title: title, 
    description: description,
    created_by: req.session.username,
    createdat: new Date().toUTCString(),
  };

  await Threads.create(newThread);

  setTimeout(() => deleteThread(threadId), 24 * 60 * 60 * 1000);
  res.status(200).send("Thread created successfully");
});

Board.delete('/:board', async (req, res) => {
  const { threadId } = req.body;
  try {
    await deleteThread(threadId, req.session.username);
  } catch(err) {
    console.log(err);
  }
  res.status(200).json();
});

export default Board;