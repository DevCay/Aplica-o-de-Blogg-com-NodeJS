const { text } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/categoria');
const Categoria = mongoose.model('categorias');

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get('/posts', (req, res) => {
    res.send('Página de POSTS');
});

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        res.render('admin/categorias', {categorias: categorias});
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listas as categorias')
        res.redirect('/admin')
    })
});
router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias');
});
router.post('/categorias/nova', (req, res) => {

    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: 'Nome inválido!'})
    };

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: 'Slug inválido'})
    };

    if(req.body.nome.length < 2){
        erros.push({text: 'Nome da categoria muito curto'})
    };

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao salvar a categoria. Tenta novamente.')
            res.redirect('/admin');
        })
    };
});

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe!')
        res.redirect('/admin/categorias')
    })
});

router.post('/categorias/edit', async (req, res) => {

    try{
        await Categoria.updateOne(
            //filter
            {_id: req.body.id},
            //updade
            {
                nome: req.body.nome,
                slug: req.body.slug
            }
        );
    }catch(err){
        console.log(err);
        req.flash('error_msg', 'erro ao editar e bla bla bal')
        res.redirect('/admin/categorias')
    }
    
    req.flash('success_msg', 'Edição feita com sucesso!');
    res.redirect('/admin/categorias');
});

module.exports = router;