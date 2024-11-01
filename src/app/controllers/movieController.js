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
      let info_movie = {}
      info_movie["name"] = data.movie.name
      info_movie["origin_name"] = data.movie.origin_name
      info_movie["status"] = data.movie.episode_current
      info_movie['poster_url'] = data.movie.poster_url
      info_movie['time'] = data.movie.time
      info_movie['episode_total'] = data.movie.episode_total
      info_movie['year'] = data.movie.year
      info_movie['quality'] = data.movie.quality
      info_movie['lang'] = data.movie.lang
      
      info_movie['watch_movie'] = []
      let link = data.episodes[0].server_data
      for (let i = 0; i < link.length; i++) {
        info_movie['watch_movie'].push(link[i].link_embed)
      }

      res.render('movie', { info_movie })
    })
    .catch(next) 
  }
}

module.exports = new HomeController();
