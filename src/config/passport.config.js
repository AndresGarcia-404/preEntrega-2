import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import { userModel } from "../models/users.model.js";
import {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} from "../consts.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
    }, async (req, email, password, done) => {
        const { first_name, last_name, age} = req.body;
        try {
            let user = await userModel.findOne({ email: email });
            if (user) {
                return done(null, false, { message: 'User already exists' });
            }
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
            };
            let result = await userModel.create(newUser);
            return done(null,result);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('signin', new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email: email });
            if (!user) {
                console.log('User not found');
                return done(null, false, { message: 'User not found' });
            }
            if (!isValidPassword(password, user)) {
                console.log('Incorrect password');
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `http://localhost:8080/api/sessions/githubcallback`
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile.emails[0].value});
            if(!user) {
                const newUser = {
                    first_name: profile.displayName,
                    last_name: '_',
                    email: profile.emails[0].value,
                    age: 18,
                    password: '_',
                };
                let result = await userModel.create(newUser);
                return done(null,result);
            } else {
                return done(null,user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });

}

export default initializePassport;