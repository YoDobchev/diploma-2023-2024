import express, {Express} from 'express';
import path from 'path';
import 'dotenv/config';

const app: Express = express();

if (!process.env.ROOTDIR) throw new Error("Root directory is not declared!");

app.use("/public", express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(process.env.ROOTDIR, 'src', 'views'));

import Home from "./home";
app.use('/', Home);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
