const { sequelize, User } = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { newUserSchema, updateUserSchema } = require("../myJoi.js");

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: "err" });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: err });
    
        req.user = user;
    
        next();
    });
}

route.use(authToken);

route.get('/users', (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
            if (usr.role === 'admin') {
                User.findAll()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "This user is not an admin"});
            }
        })
        .catch( err => res.status(500).json(err) );

});

route.post('/users', (req, res) => {

    const validInput = newUserSchema.validate(req.body);
    if(validInput.error){
        res.status(422).json({ msg: validInput.error.message })
    }else{
    User.findOne({ where: { id: req.user.userId } })
        .then( usr => {
                if (usr.role === 'admin') {
                            const obj = {
                                name: req.body.name,
                                username: req.body.username,
                                password: bcrypt.hashSync(req.body.password, 10),
                                role: req.body.role
                            };
                            User.create(obj)
                            .then( rows => res.json(rows) )
                            .catch( err => res.status(500).json(err) );
                } else {
                res.status(403).json({ msg: "This user is not an admin"});
                }   
        })
        .catch( err => res.status(500).json(err) );
    }
});

route.put('/users/:id', (req, res) => {
    const validInput = updateUserSchema.validate(req.body);
    if(validInput.error){
        es.status(422).json({ msg: validInput.error.message })
    }else{
        User.findOne({ where: { id:  req.user.userId } })
        .then( usr => {
            if (usr.role === 'admin') {
                User.findOne({ where: { id : req.params.id } })
                    .then( user => {
                        user.name = req.body.name;
                        user.username = req.body.username;
                        user.password = bcrypt.hashSync(req.body.password, 10),
                        user.role = req.body.role;

                        user.save()
                            .then( rows => res.json(rows) )
                            .catch( err => res.status(500).json(err) );
                    } )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "This user is not an admin"});
            }
        })
        .catch( err => res.status(500).json(err) );
    }

});


route.delete('/users/:id', (req, res) => {
    User.findOne({ where: { id: req.params.id } })
        .then( usr => {
            if (usr.role === 'admin') {
                User.findOne({ where: { id : req.params.id } })
                    .then( user => {
                        user.destroy()
                            .then( rows => res.json(rows) )
                            .catch( err => res.status(500).json(err) );
                    } )
                    .catch( err => res.status(500).json(err) );
            } else {
                res.status(403).json({ msg: "This user is not admin!"});
            }
        })
        .catch( err => res.status(500).json(err) );
});

module.exports = route;
