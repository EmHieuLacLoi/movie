const api = require("../../config/api/index.js");
const slugify = require('slugify') 
const link_img = "https://img.ophim.live/uploads/movies/";
class MovieController {
//Thong tin chi tiet phim va so tap
  async show(req, res, next) {
    try {
      let param = req.path;
      const data = await api.getData(param)

      let info_movie = {};
      info_movie["name"] = data.movie.name;
      info_movie["origin_name"] = data.movie.origin_name;
      info_movie["status"] = data.movie.episode_current;
      info_movie["slug"] = data.movie.slug;

      const thumbValid = await api.checkImageUrls([data.movie.thumb_url, data.movie.poster_url])
      for(let i = 0; i < thumbValid.length; i++) {
        if (thumbValid[i].status == true) {
          info_movie["thumb_url"] = thumbValid[i].url
        }
      }
      
      info_movie["time"] = data.movie.time;
      info_movie["episode_total"] = data.movie.episode_total;
      info_movie["year"] = data.movie.year;
      info_movie["quality"] = data.movie.quality;
      info_movie["lang"] = data.movie.lang;
      info_movie["country"] = data.movie.country[0].name;


      info_movie["episodes"] = [];
      let link = data.episodes[0].server_data;
      for (let i = 0; i < link.length; i++) {
        info_movie["episodes"].push(data.movie.slug);
      }
      res.render("movie", { info_movie });
    } 
    catch (error) {
      let status = error.name
      if (error.response) {
        status = error.response.status;
      }
      res.render("error", { status });
    }
  }

  watch(req, res, next) {
    let param = '/' + req.params.slug;
    let ep = Number(req.query.ep)
    api
      .getData(param)
      .then((data) => {
        let link = data.episodes[0].server_data[ep - 1].link_embed;
        let episodes = data.episodes[0].server_data
        param = req.params.slug
        res.render("watchMovie", { link, param, episodes });
      })
      .catch((error) => {
        let status = error.name
        if (error.response) {
          status = error.response.status;
        }
        res.render("error", { status });
      });
  }
}

module.exports = new MovieController();
