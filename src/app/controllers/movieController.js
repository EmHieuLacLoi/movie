const listMovie = require("../models/listMovie.js");
const { multipleMongooseToObject } = require("../../utils/mongoose.js");
const axios = require("axios");
const BASE_URL = "https://phimapi.com/phim";

class HomeController {
  show(req, res, next) {
    let link = req.path
    axios.get(`${BASE_URL}${link}`)
    .then(response  => {
      let data = response.data
      let list = data.episodes[0].server_data
      let link_embed = {}
      for (let i = 0; i < list.length; i++) {
        link_embed[i] = list[i].link_embed
      }
      res.render('movie', { link_embed })
    })
    .catch(next) 
  }
}

module.exports = new HomeController();
