const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    username: { type: String, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean },
    movies: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", user);