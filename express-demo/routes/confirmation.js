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
               console.log(`${docs} book was updated successfully!`);
               return res.redirect('http://localhost:4200/login');
           } else{
               console.log('sball hoi nakne');
               
           }
       })
    
});

module.exports = router;