const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const Joi = require('joi');
const User = require('../model/user.model');

router.use(express.json());

//registering new user
router.post('/', (req, res) => {
    const result = validateCourse(req.body);
    if(result.error){
        res.status(400).send(`Bad request! ${result.error.details[0].message}`);
        return;
    }

    const user = new User(_.pick(req.body, ['name', 'email', 'password']));

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(!err){
                user.password = hash;
                user.save((err, docs)=>{
                    if(!err){
                        res.json(_.pick(docs, ['_id', 'name', 'email']));
                    }
                    else{
                        res.send(err.message);
                    }
                });
            }
        });
    });
});


//validadting user prperties
function validateCourse(user){
    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema);
}


module.exports = router;