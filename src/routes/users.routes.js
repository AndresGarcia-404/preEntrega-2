import { Router } from "express";
import { userModel } from "../models/users.model.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";

const router = Router();

router.get('/signin', async (req, res)=>{
    res.render('signin');
});

router.post('/signin', async (req, res)=>{
    const {email, password} = req.body;
    if (email=="adminCoder@coder.com" && password == "adminCod3r123") {
        res.cookie('user_name',"CoderAdmin")
        res.cookie('userRole','Admin')
        res.redirect('/products/1');
    }
    const errors = [];
    const user = await userModel.findOne({email: email});
    if (!user) {
        errors.push({text: 'User not found'});
    }
    if (user && !isValidPassword(password, user)) {
        errors.push({text: 'Password incorrect'});
    }
    if(errors.length > 0){
        res.render('signin',{errors});
    } else {
        req.session.user = user;
        res.cookie('user_name',user.first_name)
        res.cookie('userRole','Usuario')
        res.redirect('/products/1');
    }
})

router.get('/register', async (req, res)=>{
    res.render('register');
});

router.post('/register', async (req, res)=>{
    const {first_name, last_name, age,email, password, ConfPassword} = req.body;
    const errors = [];
    if (password !== ConfPassword) {
        errors.push({text: 'Password do not match'});
    }
    if (password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if(errors.length > 0){
        res.render('register',{errors});
    } else {
        const result = await userModel.create({first_name, last_name, age,email, password: createHash(password)});
        res.cookie('user_name',first_name)
        res.cookie('userRole','Usuario')
        res.redirect('/products/1');
    }
})

export default router;