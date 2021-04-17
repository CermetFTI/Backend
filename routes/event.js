var express = require('express');
const db = require('.././db');
var router = express.Router();

router.use(express.json(),express.urlencoded({extended:false}));

router.post('/',(req,res)=>{
    const {kategori, deskripsi, link, poster, tanggal_buka, tanggal_tutup} = req.body
    console.log(req.user)
    if (req.user) {
        var sql = `INSERT INTO event 
        (kategori, deskripsi, link, poster, tanggal_buka, tanggal_tutup, id_admin) 
        VALUES (?,?,?,?,?,?,?)`;
        values = [kategori, deskripsi, link, poster, tanggal_buka, tanggal_tutup, req.user.id]
        db.execute(
            sql,
            values,
            (err,result)=>{
                if(err){
                    res.status(403).send(err)
                } else {
                    res.json(result)
                }
            }
        )
    } else {
        res.status(403).send({msg:"Not authenticated"})
    }
    
})

router.get('/',(req,res)=>{
    sql = `SELECT * FROM event`;
    db.query(
        sql,
        (err,result)=>{
            if(err){
                res.status(403).send(err)
            } else {
                res.json(result)
            }
        }
    )
})

router.get('/:id',(req,res)=>{
    sql = `SELECT * FROM event WHERE id=${req.params.id}`;
    db.query(
        sql,
        (err,result)=>{
            if(err){
                res.status(403).send(err)
            } else {
                res.json(result)
            }
        }
    )
})

router.put('/:id',(req,res)=>{
    update = {}
    data = req.body
    values = []
    for(const i in req.body){
        if(data[i] !== undefined && data[i] !== null){ 
            update[i]=data[i]
            values.push(data[i])
        } else {
            continue
        }
    }
    sentence = "";
    for(var i =0;i<Object.keys(update).length;i++){
        sentence+=Object.keys(update)[i]
        sentence+=' = ?'
        if(i!==Object.keys(update).length-1){
            sentence+=","
        }
    }
    sql = `UPDATE event SET ${sentence} WHERE id=${req.params.id}`
    db.execute(
        sql,
        values,
        (err,result)=>{
            if(err){
                res.status(403).send(err)
            } else {
                res.json(result)
            }
        }
    )
})

router.delete('/:id', (req,res)=>{
    db.execute(
        `DELETE FROM event WHERE id=${req.params.id}`,
        (err,result)=>{
            if(err){
                res.status(403).send(err)
            } else {
                res.json(result)
            }
        }
    )
})

module.exports = router