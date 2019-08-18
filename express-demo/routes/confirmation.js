const express = require("express");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const router = express.Router();
const Joi = require("joi");
const User = require("./../model/user.model");

router.use(express.json());

router.get('/:id', (req, res) => {
    console.log('Confirmed');
       const user = User.findById(req.params.id, (err, docs) => {
           if(!err){
               docs.isVerified = true;
               docs.save();
               console.log(`Activation successful`);
               return res.redirect('http://localhost:4200/login');
           } else{
               console.log('Activation failed!');
               return res.status(400).json('Activation failed!');
           }
       })
    
});

module.exports = router;