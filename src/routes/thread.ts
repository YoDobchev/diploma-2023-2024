import { Router, Request } from "express";
import multer from "multer";
import path from 'path';
import Jimp from "jimp";
import fs from 'fs';
import Posts from "../models/Posts.model";
import { createPost, findPostsByThreadId } from "../functions/common";

const Thread = Router({ mergeParams: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/temp/original')
    },
    filename: (req, file, cb) => {
        cb(null, req.headers['session-id'] + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage});

// actually braindead
interface ThreadRequestParams {
    board: string;
    thread: string;
    [key: string]: string;
}
  
interface ThreadRequest extends Request {
    params: ThreadRequestParams;
}

Thread.get('/:thread', async (req: ThreadRequest, res) => {
    const { board, thread } = req.params;
    console.log(req.session.id)
    // const posts = await Posts.findAll({where: {thread_id: thread}});
    const posts = await findPostsByThreadId(thread);
    res.render('thread.ejs', {board: board, thread: thread, posts: posts, user: req.session.username});
    // posts.forEach(post => {
    //     console.log(post.images)

    // });
});

Thread.post('/:thread/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("kur")
    }
    res.json({ filepath: '/public/images/temp/original/' + req.file?.filename})
});

Thread.patch('/:thread/filter', async (req, res) => {
    // console.log(req.body.hue)
    const options = [
        { apply: 'hue', params: [Number(req.body.hue)] }
    ]
    const session_id = req.headers['session-id'];
    const ext = req.body.ext;
    const imagePath = `public/images/temp/original/${session_id}.${ext}`;
    const outputPath = `public/images/temp/filtered/${session_id}.${ext}`;

    const image = await Jimp.read(imagePath);
    // @ts-ignore
    await image.color(options).writeAsync(outputPath);
    res.json({ filepath: '/public/images/temp/filtered/' + session_id + '.' + ext})
        // .set('Cache-Control', 'no-cache');

});

Thread.post('/:thread/createPost', async (req, res) => {
    const session_id = req.headers['session-id'];
    const ext = req.body.ext;

    const unfiltered = `public/images/temp/original/${session_id}.${ext}`;
    const filtered = `public/images/temp/filtered/${session_id}.${ext}`;
    const outputFile = `public/images/archived/${session_id}.${ext}`;
    
    if (fs.existsSync(filtered)) {
        await fs.promises.rename(filtered, outputFile);
        await fs.promises.unlink(unfiltered);
    } else if (fs.existsSync(unfiltered)) {
        await fs.promises.rename(unfiltered, outputFile);
    }

    // const newPost: any = {
    //     id: req.body.postId,
    //     thread_id: req.params.thread,
    //     // image: `${session_id}.${ext}`,
    //     text: req.body.text
    // }
    await createPost(req.params.thread, req.body.text, 'cat', 'car');

    // await Posts.create(newPost);
});

export default Thread;