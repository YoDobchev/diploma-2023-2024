import express, {Express} from 'express';
import path from 'path';
import 'dotenv/config';
import { db } from '../init/db';
import session from 'express-session';

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
app.use(session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(process.env.ROOTDIR, 'src', 'views'));

import Home from "./home";
import Board from "./board";
import Login from './login';
import Logout from './logout';
import Register from './register';
app.use('/', Home);
app.use('/login', Login);
app.use('/logout', Logout);
app.use('/register', Register);
app.use('/', Board);

db.authenticate();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
