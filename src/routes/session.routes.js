import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/github", passport.authenticate('github',{scope:['user:email']}),async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products/1');
})

router.get("/current", async (req, res) => {
    if (req.user) {
        res.json(req.user);
    }
    else {
        res.status(200).send("User not logged in");
    }

});

export default router;