import { Router } from "express";
import bcrypt from 'bcrypt';
import Users from "../models/Users.model";

const Login =  Router();

Login.get('/', (req, res) => {
    res.render('login.ejs')
});

Login.post('/', async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({where: {username: username} });
    if (!user) {
        return res.status(401).send();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send();
    }

    req.session.username = username;
    res.status(200).send();
});

export default Login;