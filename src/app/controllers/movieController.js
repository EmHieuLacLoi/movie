const api = require("../../config/api/index.js");

class HomeController {
  show(req, res, next) {
    let link = req.path;
    api
      .getData(link)
      .then((data) => {
        let info_movie = {};
        info_movie["name"] = data.movie.name;
        info_movie["origin_name"] = data.movie.origin_name;
        info_movie["status"] = data.movie.episode_current;
        info_movie["poster_url"] = data.movie.poster_url;
        info_movie["time"] = data.movie.time;
        info_movie["episode_total"] = data.movie.episode_total;
        info_movie["year"] = data.movie.year;
        info_movie["quality"] = data.movie.quality;
        info_movie["lang"] = data.movie.lang;
        info_movie["country"] = data.movie.country[0].name;


        info_movie["watch_movie"] = [];
        link = data.episodes[0].server_data;
        for (let i = 0; i < link.length; i++) {
          info_movie["watch_movie"].push(link[i].link_embed);
        }

        res.render("movie", { info_movie });
      })
      .catch((error) => {
        next(error); 
      });
  }
}

module.exports = new HomeController();
