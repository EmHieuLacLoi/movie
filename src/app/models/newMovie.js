const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newMovie = new Schema(
  {
    name: { type: String },
    origin_name: { type: String },
    slug: { type: String, unique: true},
    poster: { type: String },
    year: { type: Number },
    category: { type: String},
  }
);

module.exports = mongoose.model("new_movie", newMovie);
