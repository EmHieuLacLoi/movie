const listMovie = require("../models/listMovie.js");
const { multipleMongooseToObject } = require('../../utils/mongoose.js');

class HomeController {
  show(req, res, next) {
    listMovie.find({})
      .then((movie) => {
        movie = multipleMongooseToObject(movie)
        res.render('movie', { movie })
      })
      .catch(next);
  }
}

module.exports = new HomeController();