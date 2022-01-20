const { sequelize, Post, User, Comment } = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { newCommentSchema, updateCommentSchema } = require("../myJoi.js");

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

route.get('/comments', (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                Comment.findAll()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "Invalid credentials"});
            }
        })    
});

route.get('/comments/:id', (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                Comment.findOne({ where: { id : req.params.id } })
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "Invalid credentials"});
            }
        })
        .catch( err => res.status(500).json(err) );
});

route.post('/comments', (req, res) => {
    const validInput = newCommentSchema.validate(req.body);
    if(validInput.error){
        res.status(422).json({ msg: validInput.error.message })
    }else{
        User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                    Comment.create({ content: req.body.content, userId: req.user.userId, postId: req.body.postId })
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "Invalid credentials"});
            }
            
        })
        .catch( err => res.status(500).json(err) );
    }

});

route.put('/comments/:id', (req, res) => {
    const validInput = updateCommentSchema.validate(req.body);
    if(validInput.error){
        res.status(422).json({ msg: validInput.error.message })
    }else{
        User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                        Comment.findOne({ where: { id : req.params.id }})
                        .then( comment => {
                            comment.userId = req.user.userId;
                            comment.postId = req.body.postId;
                            comment.content = req.body.content;
                            comment.save()
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

route.delete('/comments/:id', (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                Comment.findOne({ where: { id : req.params.id }})
                    .then( comments => {
                        comments.destroy()
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