const mysql = require('mysql2');
require('dotenv').config()

const dbConnection = mysql.createConnection({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: 'Thiago2507!',
    database: 'mail-aadi'
});

dbConnection.connect(function (err){
    if(err){
        console.error(err)
        return
    }else{
        console.log("base de datos conectada")
    }
});

module.exports = dbConnection;