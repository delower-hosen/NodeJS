var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'delower.hosen00@gmail.com',
    pass: 'del130404'
  }
});

var mailOptions = {
  from: 'delower.hosen00@gmail.com',
  to: 'delowerhosencuet13@gmail.com',
  subject: 'Sending Email using Node.js',
  text: `Hi Smartherd, thank you for your nice Node.js tutorials.
          I will donate 50$ for this course. Please send me payment options.`
  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});