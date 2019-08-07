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

router.get("/me", auth, async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//registering new user
router.post("/", (req, res) => {
  const result = validateCourse(req.body);
  console.log(result);
  if (result.error) {
    // res.status(400).send(`Bad request! ${result.error.details[0].message}`);
    return res.json({ isInvalid: true });
  }

  const user = new User(_.pick(req.body, ["name", "email", "password"]));
  console.log(user);
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (!err) {
        user.password = hash;
        user.save((err, docs) => {
          if (!err) {
            // let transporter = nodemailer.createTransport({
            //     host: "smtp.ethereal.email",
            //     port: 587,
            //     secure: false, // true for 465, false for other ports
            //     auth: {
            //       user: 'delower.hosen00gmail.com', // generated ethereal user
            //       pass: 'del1304104' // generated ethereal password
            //     }
            //   });
            
            //   // send mail with defined transport object
            //   let info = transporter.sendMail({
            //     from: '"Fred Fo" <delower.hosen00gmail.com>', // sender address
            //     to: "delower.hosen@selise.ch", // list of receivers
            //     subject: "Hello ✔", // Subject line
            //     text: "Hello world?", // plain text body
            //     html: "<b>Hello world?</b>" // html body
            //   });
            
            //   console.log("Message sent: %s", info.messageId);
            //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
            //   // Preview only available when sending through an Ethereal account
            //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            const token = jwt.sign(
              { _id: docs._id, name: docs.name },
              config.get("jwtPrivateKey")
            );
            res
              .header("x-authentication-token", token)
              .send(_.pick(docs, ["_id", "name", "email"]));
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
    name: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .min(5)
      .required()
      .email({ minDomainSegments: 2 }),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports = router;
