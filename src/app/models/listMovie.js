const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listMovie = new Schema(
  {
    name: { type: String },
    slug: { type: String },
    poster: { type: String },
    year: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("list_movie", listMovie);
