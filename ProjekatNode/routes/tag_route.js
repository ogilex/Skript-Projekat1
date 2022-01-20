const { sequelize, Post, User, Tag } = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Joi = require('joi');
const { newTagSchema, updateTagSchema } = require('../myJoi');

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

route.get('/tags', (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                Tag.findAll()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "Invalid credentials"});
            }
        })
        .catch( err => res.status(500).json(err) );    
});


route.post('/tags', (req, res) => {
    const validInput = newTagSchema.validate(req.body);
    if(validInput.error){
        res.status(422).json({ msg: validInput.error.message })
    }else{
        User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                    Tag.create({ title: req.body.title })
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "Invalid credentials"});
            }
            
        })
        .catch( err => res.status(500).json(err) );
    }

});

route.put('/tags/:id', (req, res) => {
    const validInput = updateTagSchema.validate(req.body);
    if(validInput.error){
        res.status(422).json({ msg: validInput.error.message })
    }else{
        User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                        Tag.findOne({ where: { id : req.params.id }})
                        .then( tag => {
                            tag.title = req.body.title;
                            tag.save()
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

route.delete('/tags/:id', (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'moderator' || usr.role === 'admin') {
                Tag.findOne({ where: { id : req.params.id }})
                    .then( tag => {
                        tag.destroy()
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
