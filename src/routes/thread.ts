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
        cb(null, String(req.headers['image-filename']));
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
    console.log(req.session.username)
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    res.json({ filepath: `/public/images/temp/original/${req.headers['image-filename']}`});
});


Thread.patch('/:thread/filter', async (req, res) => {
    const imageId = req.body.imageId;
    console.log(imageId)
    const imageExt = req.body.imageExt;
    const filters = req.body.filters;

    const options = [
        { apply: 'lighten', params: [Number(filters.LIGHTEN)] },
        { apply: 'brighten', params: [Number(filters.BRIGHTEN)] },
        // { apply: 'darken', params: [Number(filters.DARKEN)] },
        // { apply: 'saturate', params: [Number(filters.SATURATE)] },
        // { apply: 'saturate', params: [Number(filters.DESATURATE)] },
        // { apply: 'greyscale', params: [Number(filters.GRAYSCALE)] },
        // { apply: 'hue', params: [Number(filters.HUE)] },
        // { apply: 'tint', params: [Number(filters.TINT)] },
        // { apply: 'shade', params: [Number(filters.SHADE)] },
        // { apply: 'red', params: [Number(filters.RED)] },
        // { apply: 'green', params: [Number(filters.GREEN)] },
        // { apply: 'blue', params: [Number(filters.BLUE)] },
    ]

    const imagePath = `public/images/temp/original/${imageId}.${imageExt}`;
    const outputPath = `public/images/temp/filtered/${imageId}.${imageExt}`;

    const image = await Jimp.read(imagePath);
    // @ts-ignore
    await image.color(options).writeAsync(outputPath);
    res.json({ filepath: '/public/images/temp/filtered/' + imageId + '.' + imageExt})
});

Thread.post('/:thread/createPost', async (req, res) => {
    const imageId = req.body.imageId;
    const imageExt = req.body.imageExt;
    const username = req.session.username;
    let outputFile;
    if (imageId && imageExt) {
        const unfiltered = `public/images/temp/original/${imageId}.${imageExt}`;
        const filtered = `public/images/temp/filtered/${imageId}.${imageExt}`;
        outputFile = `public/images/archived/${imageId}.${imageExt}`;
        if (fs.existsSync(filtered)) {
            await fs.promises.rename(filtered, outputFile);
            await fs.promises.unlink(unfiltered);
        } else if (fs.existsSync(unfiltered)) {
            await fs.promises.rename(unfiltered, outputFile);
        }
    }

    await createPost(req.params.thread, req.body.text, req.session.username, req.body.replyToId, outputFile)
    res.status(200).json({});
});

export default Thread;