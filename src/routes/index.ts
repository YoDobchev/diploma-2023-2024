import express, {Express} from 'express';
import path from 'path';
import 'dotenv/config';

const app: Express = express();

if (!process.env.ROOTDIR) throw new Error("Root directory is not declared!");

app.use(express.json())
app.use("/public", express.static("public", {
    setHeaders: function (res, path) {
        if (path.endsWith('.jpg') || path.endsWith('.png')) {
            res.set('Cache-Control', 'no-cache');
        }
    }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(process.env.ROOTDIR, 'src', 'views'));

import Home from "./home";
import Board from "./board";
app.use('/', Home);
app.use('/', Board);
// app.use('/:board_id/:thread_id', Board);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
