// Carregando módulos
    const express = require('express');
    const { engine } = require ('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin');
    const path = require('path');
    const mongoose = require('mongoose');
    const  session = require('express-session');
    const flash = require('connect-flash');

//Configurações
    //Sessão
        app.use(session({
            secret: 'cursonode',
            resave: true,
            saveUninitialized: true
        }));
        app.use(flash());
    //Midleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            next();
        });
    //Body-Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    //Handlebars
        app.engine('handlebars', engine());;
        app.set('view engine', 'handlebars');
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp').then(() => {
            console.log('Conectado ao Mongo')
        }).catch((err) => {
            console.log('Erro ao conectar' + err)
        });
    //Public
        app.use(express.static('public'));
        app.use(express.static('files'));
        app.use((req, res, next) => {
            console.log('EU SOU UM MIDDLEWARE!')
            next();
        })

//Rotas
    app.use('/admin', admin);
//Outros
const port = 8081;
app.listen(port, () => {
    console.log('Servidor rodando!')
});