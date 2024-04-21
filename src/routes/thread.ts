import { Router, Request } from "express";
import multer from "multer";
import Jimp from "jimp";
import fs from 'fs';
import { exiftool } from 'exiftool-vendored';
import { createPost, deletePost, findPostsByThreadId } from "../functions/common";
import Threads from "../models/Threads.model";

const Thread = Router({ mergeParams: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/temp/original');
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
      return res
        .status(404)
        .render('error.ejs', { code: 404, message: 'Thread not found!', link: `/${board}`});
    }

    const posts = await findPostsByThreadId(thread);
    res.render('thread.ejs', { board: board, thread: thread, threadTitle: Thread.title, posts: posts, user: req.session.username });
});

Thread.post('/:thread/upload', upload.single('image'), (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ error: "Unathorized." });
    }

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    res.json({ filepath: `/public/images/temp/original/${req.headers['image-filename']}`});
});

Thread.patch('/:thread/filter', async (req, res) => {
    const { imageId, imageExt } = req.body;

    type FilterSetting = {
        label: string;
        min: number;
        max: number;
        value: number;
        defaultValue: number;
    };
    const filterSettings : Record<string, FilterSetting> = req.body.filterSettings;

    const options = Object.entries(filterSettings)
        .filter(([key, setting]) => setting.value !== setting.defaultValue)
        .map(([key, setting]) => ({
            apply: setting.label.toLowerCase(),
            params: [Number(setting.value)],
        }));
    console.log(options);

    const imagePath = `public/images/temp/original/${imageId}.${imageExt}`;
    const outputPath = `public/images/temp/filtered/${imageId}.${imageExt}`;

    let image = await Jimp.read(imagePath);
    // @ts-ignore
    await image.color(options).writeAsync(outputPath);
    if (['jpg', 'jpeg'].includes(imageExt.toLowerCase())) {
        const metadata = await exiftool.read(imagePath);
        if (metadata && metadata.Orientation) {
            image = await Jimp.read(outputPath);
            switch (metadata.Orientation) {
                case 6:
                    image.rotate(180);
                    break;
                case 8:
                    image.rotate(-90);
                    break;
            }
            await image.writeAsync(outputPath);
        }
    }
    res.json({ filepath: '/public/images/temp/filtered/' + imageId + '.' + imageExt });
});

Thread.post('/:thread/createPost', async (req, res) => {
    const { imageId, imageExt } = req.body;

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

    await createPost(req.params.thread, req.body.text, req.session.username, req.body.replyToId, imageId, outputFile);
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
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Failed to delete post:', error);
        res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
});

Thread.delete('/:thread/removeImg', async (req, res) => {
    const { imageId, imageExt } = req.body;

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
