const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const Joi = require('joi');
const User = require('../model/user.model');

router.use(express.json());

//login users
router.post('/', (req, res) => {
    const result = validateCourse(req.body);
    if(result.error){
        res.status(400).send(`Bad request! ${result.error.details[0].message}`);
        return;
    }

    User.findOne({email: req.body.email}, (err, docs)=>{
        if(!docs){
            return res.status(400).send('Invalid email or password!');
        }
        else if(docs){
            bcrypt.compare(req.body.password, docs.password, (err, validPassword)=> {
                if(!validPassword) return res.status(400).send('Invalid email or password!');
                else{
                    const token = jwt.sign({ _id: docs._id, name: docs.name }, 'jwtprivatekey');
                    res.json(token);
                }
            });
        }
    });

});


//validadting user prperties
function validateCourse(user){
    const schema = {
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema);
}


module.exports = router;