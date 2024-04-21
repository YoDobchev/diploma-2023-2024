import { Router } from "express";

const Logout =  Router();

Logout.get('/', (req, res) => {
    const redirectUrl = req.query.redirect;
    req.session.username = undefined;

    if (redirectUrl && redirectUrl != '') {
        return res.redirect(`/login?redirect=${redirectUrl}`);
    }
    res.redirect('/login');
});

export default Logout;
