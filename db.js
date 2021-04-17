const mysql = require('mysql2');
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: 'cermet',
    password: 'Patriot*100',
});

module.exports = db;
