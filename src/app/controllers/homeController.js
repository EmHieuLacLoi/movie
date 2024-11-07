const mongoose = require("mongoose");

// Configure global mongoose settings
mongoose.set("debug", true); // Enable debug logging
mongoose.set("bufferTimeoutMS", 30000); // Increase buffer timeout to 30 seconds

const listMovie = require("../models/listMovie.js");
const { multipleMongooseToObject } = require("../../utils/mongoose.js");
const api = require("../../config/api/index.js");

class HomeController {
  home(req, res, next) {
    // Add more robust error handling
    listMovie
      .find({})
      .maxTimeMS(10000) // Set maximum query time
      .then((movie) => {
        if (!movie || movie.length === 0) {
          console.warn("No movies found");
          return res.render("home", { movie: [] });
        }

        movie = multipleMongooseToObject(movie);
        res.render("home", { movie });
      })
      .catch((error) => {
        console.error("Database Query Error:", {
          message: error.message,
          name: error.name,
          code: error.code,
        });

        // Send error response
        res.status(500).render("error", {
          message: "Unable to fetch movies",
          error: error,
        });

        // Pass to error handling middleware
        next(error);
      });
  }

  search(req, res, next) {
    const body = req.body.search;
    const link_img = "https://phimimg.com/";
    api
      .searchData(body)
      .then((data) => {
        let list = data.data.items;
        const search_result = [];
        for (let i = 0; i < list.length; i++) {
          const info_movie = {};
          info_movie["name"] = list[i].name;
          info_movie["slug"] = list[i].slug;
          info_movie["origin_name"] = list[i].origin_name;
          info_movie["status"] = list[i].episode_current;
          info_movie["thumb_url"] = link_img + list[i].thumb_url;
          info_movie["time"] = list[i].time;
          info_movie["year"] = list[i].year;
          info_movie["quality"] = list[i].quality;
          info_movie["lang"] = list[i].lang;
          info_movie["country"] = list[i].country[0].name;
          search_result.push(info_movie);
        }
        res.render("search", { search_result });
      })
      .catch((error) => {
        let status = error.name
        if (error.response) {
          status = error.response.status;
        }
        res.render("error", { status });
      });
  }

  show(req, res, next) {
    let body = 1
    api
      .updatedMovieData(body)
      .then((data) => {
        let list = data.items;
        const search_result = [];
        for (let i = 0; i < list.length; i++) {
          const info_movie = {};
          info_movie["name"] = list[i].name;
          info_movie["slug"] = list[i].slug;
          info_movie["origin_name"] = list[i].origin_name;
          info_movie["thumb_url"] = list[i].thumb_url;
          info_movie["year"] = list[i].year;
          search_result.push(info_movie);
        }
        res.render("newMovie", { search_result });
      })
      .catch((error) => {
        let status = error.response.status;
        res.render("error", { status });
      });
  }

  update(req, res, next) {
    let body = 1
    console.log(req.query.page)
    if (req.query.page) {
      body = req.query.page
    }
    api
      .updatedMovieData(body)
      .then((data) => {
        let list = data.items;
        const search_result = [];
        for (let i = 0; i < list.length; i++) {
          const info_movie = {};
          info_movie["name"] = list[i].name;
          info_movie["slug"] = list[i].slug;
          info_movie["origin_name"] = list[i].origin_name;
          info_movie["thumb_url"] = list[i].thumb_url;
          info_movie["year"] = list[i].year;
          search_result.push(info_movie);
        }
        res.render("newMovie", { search_result });
      })
      .catch((error) => {
        let status = error.response.status;
        res.render("error", { status });
      });
  }
}

module.exports = new HomeController();
