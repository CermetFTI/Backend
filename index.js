const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors =  require('cors');
const pino = require('express-pino-logger')({prettyPrint:true});
require('dotenv').config();

const store = new session.MemoryStore();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(session({
    secret: process.env.SECRET,
    cookie: {maxAge:60000},
    saveUninitialized: true,
    proxy: true,
    resave: true,
    store
}))
app.use(require('cookie-parser')());
app.use(passport.initialize(),passport.session())

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}),(res,req,next)=>{next()})

// Api member
app.use('/auth',require('./routes/auth'));
app.use('/event',require('./routes/event'));
app.use(express.json(),express.urlencoded({extended:false}));
app.use(pino)

app.listen(
    PORT,
    () => console.log(`Running on port ${PORT}`)
);