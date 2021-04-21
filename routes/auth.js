var express = require('express');
const passport = require('passport');
const local = require('.././strategies/local');
const os = require('os');
const db = require('.././db');
var router = express.Router();
const formData = require("express-form-data");


const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
};

router.use(formData.parse(options),passport.initialize(),passport.session(),express.json(),express.urlencoded({extended:false}));


router.post('/signin', (req,res)=>{
    const {username, password, email} = req.body
    sql = `INSERT INTO user (id, name, password, is_admin, email) VALUES (UUID_TO_BIN(UUID()),'${username}',MD5('${password}'),0, '${email}')`
    db.execute(sql, (err,result)=>{
        if(err){
            res.status(403).send(err)
        } else {
            res.json(result)
        }
    })
})

router.post('/login', passport.authenticate('local'), (req,res)=>{
    res.status(200).send({msg:"Successfully Logged In!" ,username:req.body.username})
})

router.get('/logout', (req,res)=>{
    req.logout();
    res.sendStatus(200);
})

router.get('/', (req,res)=>{
    if(req.user){
        res.status(200).json({username:req.user});
    } else {
        res.sendStatus(403);
    }
})
module.exports = router