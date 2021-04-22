var express = require('express');
const db = require('.././db');
var router = express.Router();

router.use(express.json(),express.urlencoded({extended:false}));

const checker = (val) =>{
    const check = ["kategori", "deskripsi", "link", "poster", "tanggal_buka", "tanggal_tutup", "judul"]
    for(var i=0;i<check.length;i++){
        if(val === check[i]){
            return true
        }
    }
    return false
}

router.post('/', (req,res)=>{
    input_data = req.body
    input_keys = Object.keys(req.body)
    data = input_keys.filter(x=>checker(x))
    values = []
    for(var i=0;i<data.length;i++){
        values.push(input_data[data[i]])
    }
    fields = ''
    question_mark = ''
    for(var i=0;i<data.length;i++){
        fields+=data[i]
        question_mark+='?'
        if(i !== data.length-1){
            fields+=','
            question_mark+=','
        }
    }
    var sql = `INSERT INTO event 
    (${fields}) 
    VALUES (${question_mark})`;
    console.log(sql, values)
    if (req.user) {  
        db.execute(
            sql,
            [...values],
            (err,result)=>{
                if(err){
                    res.status(403).send(err)
                    console.log(err)
                } else {
                    res.json(result)
                    console.log(result)
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
    console.log(data)
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
    console.log(sql)
    if(req.user){
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
        res.sendStatus(403)
    }
})

router.delete('/:id', (req,res)=>{
    if(req.user){
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
    } else {
        res.sendStatus(403)
    }
})

module.exports = router