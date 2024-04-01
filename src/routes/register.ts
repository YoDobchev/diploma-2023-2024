import { Router } from "express";
import bcrypt from 'bcrypt';
import Users from "../models/Users.model";

const Register =  Router();

Register.get('/', (req, res) => {
    res.render('register.ejs');
});

Register.post('/', async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username } });
    if (user) {
        return res.status(400).send();
    }
    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    await Users.create({ username: username, password: hashedPassword });
    res.status(200).send();
});

export default Register;