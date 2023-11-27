var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Define a new schema for the book entity
const BookSchema = new Schema({
  ISBN: String,
  img: String,
  title: String,
  author: String,
  inventory: Number,
  category: String,
});

// Create and export the 'Book' model using the BookSchema
module.exports = mongoose.model("Book", BookSchema);
