// const mongoose = require("mongoose");
// var itemSchema = new mongoose.Schema({
//   id: {
//     type: String
//   },
//   name: {
//     type: String
//   }
// });
// module.exports = mongoose.model("items", itemSchema);

const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: String ,
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

module.exports = mongoose.model('course', courseSchema);
