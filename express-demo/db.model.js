const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  author: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  price:{
    type: Number,
    required: true,
    min: 1
  },
  date: { type: Date, default: Date.now },
  imageurl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('course', courseSchema);
