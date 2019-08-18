const auth = require("./../middleware/auth");
const express = require("express");
const config = require("config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const router = express.Router();
const Joi = require("joi");
const User = require("../model/user.model");

router.use(express.json());

//getting logged in user
router.get("/me", auth, async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//registering new user
router.post("/", (req, res) => {
  const result = validateCourse(req.body);
  console.log(result);
  if (result.error) {
    return res.json({
      isInvalid: true
    });
  }

  const user = new User(_.pick(req.body, ["name", "email", "password"]));
  console.log(user);
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (!err) {
        user.password = hash;
        user.save((err, docs) => {
          if (!err) {
            //sending verification mail
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: `${config.get('email')}`,
                pass: `${config.get('password')}`
              }
            });

            const id = docs._id;
            const url = `http://localhost:3000/api/confirmation/${id}`;

            var mailOptions = {
              from: `${config.get('email')}`,
              to: `${user.email}`,
              subject: 'Verify your email for bookshop account.',
              html: `Please click this link to confirm your email: <button><a href= "${url}">Confirm mail</a></button>`       
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            //mail sending done
          } else {
            console.log(err);
            res.json(err);
          }
        });
      }
    });
  });
});

//validadting user prperties
function validateCourse(user) {
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(5).required().email({minDomainSegments: 2}),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(user, schema);
}

module.exports = router;