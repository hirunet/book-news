const sqlite3 = require('sqlite3').verbose()
const express = require('express');
const router = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

function showLogin(req, res, next) {
    res.render("login");
}

passport.use("mylogin",
    new LocalStrategy({
        usernameField: "name",
        passwordField: "password",
    }, (name, password, done) => {
        // TODO DBからユーザ情報を取得する
        if (name === "test" && password === "test!") {
            return done(null, name);
        }
        return done(null, false);
    })
);

router.use(passport.initialize());

router.get('/login', showLogin);
router.post('/login', passport.authenticate(
    "mylogin",
    {
        successRedirect: "/",
        failureRedirect: "/login",
        session: false
    }
));

module.exports = router;
