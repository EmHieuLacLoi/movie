const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newMovie = new Schema(
  {
    name: { type: String },
    slug: { type: String, unique: true},
    poster: { type: String },
    year: { type: Number },
  }
);

module.exports = mongoose.model("new_movie", newMovie);
