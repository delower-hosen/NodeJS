const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
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
  date: { type: Date },
  imageurl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('book', bookSchema);
