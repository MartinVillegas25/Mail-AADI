const express = require('express');
const hbs = require('hbs');
const path = require('path');
const dbConnection = require('./db/database')

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/',(req, res) => {
    res.render('index')
});


app.post('/buscar',(req, res) => {
    const usuario = req.body.usuario;
    console.log(usuario);
    let sql = 'SELECT * FROM mails WHERE usuario=? '
    dbConnection.query(sql,usuario,(err, data) => {
        if(!err){
            if(data.length>0){
                res.render('index',{
                    data:true,
                    usuario: data[0].usuario,
                    nombre: data[0].nombre,
                    mail: data[0].mail,
                    error:false
                })
            }else{
                res.render('index', {
                    error:true
                })
            }
        }else{
            console.log(err);
        }
    })

    
});

app.post('/modificar', (req, res)=>{
    const {usuario, mail} = req.body;
    console.log(usuario, mail);
    let sql = 'UPDATE mails SET mail=? WHERE usuario=?'
    dbConnection.query(sql,[mail, usuario], (err,result,data) => {
        if(!err) {
            console.log(result.affectedRows)
            if(!result.affectedRows){
                console.log('hola')
                res.render('index',{
                    error:true,
                    message:'El usuario no existe en la base de datos'
                })
            }else{
                console.log(result.affectedRows)
                console.log(result,data)
                res.render('index',{
                    mensaje:true,
                    message:'Usuario modificado'
                })
                
            }

        }else{
            console.log(err.message)}
        }
    )
});

app.post('/agregar', (req, res)=>{
    const {usuario, mail, nombre} = req.body;
    console.log(usuario, mail, nombre);
    let sql = 'INSERT INTO mails (usuario, nombre, mail) VALUES ?'
    const values = [
        [usuario, nombre, mail]
    ];
    dbConnection.query(sql,[values], (err,result)=>{
        if(!err) {
            res.render('index',{
                mensaje:true,
                message: 'Usuario agregado'
            })
            
        }else{
            console.log(err)
        }
    })
    
})



app.listen(process.env.PORT || 3000, () => {
    console.log(`server en puerto ${process.env.PORT}`)
})