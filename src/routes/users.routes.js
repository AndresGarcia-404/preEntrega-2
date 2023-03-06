import { Router } from "express";
import passport from "passport";

const router = Router();

router.get('/signin', async (req, res)=>{
    res.render('signin');
});

router.post('/signin', passport.authenticate('signin',{
    successRedirect: '/products/1',
    failureRedirect: '/api/users/signin',
}),async (req, res)=>{
    if(!req.user){
        return res.status(400).send({status: 'error', message: "invalid credentials"})
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
    }
    res.send({status: 'succes', payload: req.user})
})

router.get('/logout', async (req, res)=>{
    req.session.destroy();
    console.log('session destroyed');
    res.redirect('/api/users/signin');
});

router.get('/register', async (req, res)=>{
    res.render('register');
});

router.post('/register', passport.authenticate('register',{
    successRedirect: '/api/users/signin',
    failureRedirect: '/users/register',
}),async (req, res)=>{
    res.send({status: 'succes', message: "User created"})
})

export default router;