const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const store = new session.MemoryStore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(session({
    secret: process.env.SECRET,
    cookie: {maxAge:600000},
    saveUninitialized: false,
    proxy: true,
    resave: true,
    store
}))
app.use(passport.initialize(),passport.session());

// Api member
app.use('/auth',require('./routes/auth'));
app.use('/event',require('./routes/event'));
app.use(express.json(),express.urlencoded({extended:false}));

app.listen(
    PORT,
    () => console.log(`Running on port ${PORT}`)
);