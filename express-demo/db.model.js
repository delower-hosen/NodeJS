const mongoose = require("mongoose");
var itemSchema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String
  }
});
module.exports = mongoose.model("items", itemSchema);
