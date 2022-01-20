const { sequelize, Post, User } = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { newPostSchema, updatePostSchema } = require("../myJoi.js");

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: err });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: err });
    
        req.user = user;
    
        next();
    });
}

route.use(authToken);

route.get('/posts', (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                Post.findAll()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "Invalid credentials"});
            }
        })
        .catch( err => res.status(500).json(err) );
});


route.post('/posts', (req, res) => {
    const validInput = newPostSchema.validate(req.body);
    if(validInput.error){
        res.status(422).json({ msg: validInput.error.message })
    }else{
        User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                    Post.create({ title: req.body.title, content: req.body.content, tagId: req.body.tagId, userId: req.user.userId })
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "Invalid credentials"});
            }
            
        })
        .catch( err => res.status(500).json(err) );
    }

});


route.put('/posts/:id', (req, res) => {
    const validInput = updatePostSchema.validate(req.body);
    if(validInput.error){
        res.status(422).json({ msg: validInput.error.message })
    }else{
        User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                        Post.findOne({ where: { id : req.params.id }})
                        .then( post => {
                            post.title = req.body.title;
                            post.userId = req.user.userId;
                            post.tagId = req.body.tagId;
                            post.content = req.body.content;
                            post.save()
                                .then( rows => res.json(rows) )
                                .catch( err => res.status(500).json(err) );
                        } )
                        .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "Invalid credentials"});
            }
        })
        .catch( err => res.status(500).json(err) );
    }

});

route.delete('/posts/:id', (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                Post.findOne({ where: { id : req.params.id }})
                    .then( post => {
                        post.destroy()
                            .then( rows => res.json(rows) )
                            .catch( err => res.status(500).json(err) );
                    } )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "Invalid credentials"});
            }
        })
        .catch( err => res.status(500).json(err) );
});

module.exports = route;