const auth = require('./../middleware/auth');
const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const Joi = require('joi');
const User = require('../model/user.model');

router.use(express.json());

router.get('/me', auth, async(req, res, next)=>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

//registering new user
router.post('/', (req, res) => {
    const result = validateCourse(req.body);
    console.log(result);
    if(result.error){
        // res.status(400).send(`Bad request! ${result.error.details[0].message}`);
        return res.json({isInvalid: true});
    }

    const user = new User(_.pick(req.body, ['name', 'email', 'password']));
    console.log(user);
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(!err){
                user.password = hash;
                user.save((err, docs)=>{
                    if(!err){
                        const token = jwt.sign({ _id: docs._id, name: docs.name }, config.get('jwtPrivateKey'));
                        res.header('x-authentication-token', token).send(_.pick(docs, ['_id', 'name', 'email']));
                    }
                    else{
                        console.log(err);
                        res.json(err);
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
        email: Joi.string().min(5).required().email({ minDomainSegments: 2 }),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema);
}


module.exports = router;