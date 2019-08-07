const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  }

});

module.exports = mongoose.model('user', userSchema);
