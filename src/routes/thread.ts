import { Router, Request } from "express";
import multer from "multer";
import path from 'path';
import Jimp from "jimp";
import fs from 'fs';
import Posts from "../models/Posts.model";
import { createPost, deletePost, findPostsByThreadId } from "../functions/common";
import Threads from "../models/Threads.model";

const Thread = Router({ mergeParams: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/temp/original')
    },
    filename: (req, file, cb) => {
        cb(null, String(req.headers['image-filename']));
    }
});

const upload = multer({storage: storage});

// actually braindead
interface ThreadRequestParams {
    board: string;
    thread: string;
    [key: string]: string;
};
  
interface ThreadRequest extends Request {
    params: ThreadRequestParams;
};

Thread.get('/:thread', async (req: ThreadRequest, res) => {
    const { board, thread } = req.params;

    const Thread = await Threads.findOne({ where: { id: thread } });

    if (!Thread) {
      res
        .status(404)
        .render('error.ejs', { code: 404, message: "Thread not found!"})

      return;
    }

    const posts = await findPostsByThreadId(thread);
    res.render('thread.ejs', {board: board, thread: thread, posts: posts, user: req.session.username});
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
    const imageExt = req.body.imageExt;

    type FilterSetting = {
        label: string;
        min: number;
        max: number;
        value: number;
        defaultValue: number;
    };
    const filterSettings : Record<string, FilterSetting> = req.body.filterSettings;

    var options = [];
    for (const setting in filterSettings) {
        if (filterSettings.hasOwnProperty(setting) && filterSettings[setting].value != filterSettings[setting].defaultValue) {
            options.push({apply: filterSettings[setting].label.toLowerCase(), params: [Number(filterSettings[setting].value)]})
        }
    }
    console.log(options)

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

    await createPost(req.params.thread, req.body.text, req.session.username, req.body.replyToId, imageId, outputFile)
    res.status(200).json({});
});

Thread.post('/:thread/copyImage', async (req, res) => {
    const { archivedId, archivedExt, newId } = req.body;
    const copyFrom = `public/images/archived/${archivedId}.${archivedExt}`;
    const copyTo = `public/images/temp/original/${newId}.${archivedExt}`
    await fs.promises.copyFile(copyFrom, copyTo);
});

Thread.delete('/:thread/deletePost', async (req, res) => {
    const { id } = req.body;
    const username = req.session.username;
    
    if (!username) {
        return res.status(401).json({ message: 'Unauthorized: No session found' });
    }

    try {
        await deletePost(id, username);    
    } catch (error) {
        console.error('Failed to delete post:', error);
        res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
});

Thread.delete('/:thread/removeImg', async (req, res) => {
    const imageId = req.body.imageId;
    const imageExt = req.body.imageExt;

    if (imageId && imageExt) {
        const unfiltered = `public/images/temp/original/${imageId}.${imageExt}`;
        const filtered = `public/images/temp/filtered/${imageId}.${imageExt}`;
        if (fs.existsSync(filtered)) {
            await fs.promises.unlink(filtered);
        }

        if (fs.existsSync(unfiltered)) {
            await fs.promises.unlink(unfiltered);
        }
    } 
});

export default Thread;