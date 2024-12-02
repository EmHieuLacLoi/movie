const mongoose = require("mongoose");
const slugify = require('slugify');

// Configure global mongoose settings
mongoose.set("debug", true); // Enable debug logging
mongoose.set("bufferTimeoutMS", 30000); // Increase buffer timeout to 30 seconds

const listMovie = require("../models/listMovie.js");
const { multipleMongooseToObject } = require("../../utils/mongoose.js");
const api = require("../../config/api/index.js");
const newMovie = require("../models/newMovie.js");
const link_img = "https://img.ophim.live/uploads/movies/";

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
        res.render("error", {
          status: "Không tìm thấy phim rồi!!!!",
        });
      });
  }

  search(req, res, next) {
    const body = req.query.search;

    const normalizedQuery = body
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
    
    const toSlug = slugify(normalizedQuery)
    console.log('Normalized Query:', normalizedQuery);
    console.log('Original Body:', body);
    
    newMovie
    .find({
      $or: [
        { name: { $regex: normalizedQuery, $options: 'i' } },
        { name: { $regex: body, $options: 'i' } },
        { slug: { $regex: toSlug, $options: 'i' } },
        { slug: { $regex: body, $options: 'i' } }
      ]
    })
    .then((movie) => {
      if (!movie || movie.length === 0) {
        console.warn("No movies found");
        res.render("error", { error });
      }
      else {
        movie = multipleMongooseToObject(movie);
        movie.forEach(m => {
          if (!m.poster.includes(link_img))
            m.poster = link_img + m.poster
        })
        res.render("search", { movie });
      }
    })
    .catch((error) => {
      console.error("Query Error:", {
        message: error.message,
        name: error.name,
        code: error.code,
      });

      // Send error response
      res.render("error", {
        status: "Không tìm thấy phim rồi!!!!",
      });
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

          if (list[i].poster_url == "" || !list[i].poster_url) {
            if (list[i].thumb_url.includes(link_img)) {
              info_movie["thumb_url"] = list[i].thumb_url;
            } else {
              info_movie["thumb_url"] = link_img + list[i].thumb_url;
            }
          } else {
            if (list[i].poster_url.includes(link_img)) {
              info_movie["thumb_url"] = list[i].poster_url;
            } else {
              info_movie["thumb_url"] = link_img + list[i].poster_url;
            }
          }
          
          info_movie["year"] = list[i].year;
          info_movie["modified_time"] = list[i].modified.time.slice(0, 10)
          search_result.push(info_movie);
        }
        res.render("newMovie", { search_result });
      })
      .catch((error) => {
        let status = error.name
        if (error.response) {
          status = error.response.status;
        }
        res.render("error", { status });
      });
  }

  update(req, res, next) {
    let body = 1
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
          
          if (list[i].poster_url == "" || !list[i].poster_url) {
            if (list[i].thumb_url.includes(link_img)) {
              info_movie["thumb_url"] = list[i].thumb_url;
            } else {
              info_movie["thumb_url"] = link_img + list[i].thumb_url;
            }
          } else {
            if (list[i].poster_url.includes(link_img)) {
              info_movie["thumb_url"] = list[i].poster_url;
            } else {
              info_movie["thumb_url"] = link_img + list[i].poster_url;
            }
          }

          info_movie["year"] = list[i].year;
          info_movie["modified_time"] = list[i].modified.time.slice(0, 10)
          search_result.push(info_movie);
        }
        res.render("newMovie", { search_result });
      })
      .catch((error) => {
        let status = error.name
        if (error.response) {
          status = error.response.status;
        }
        res.render("error", { status });
      });
  }

  delete(req, res, next) {
    const id = req.params.id
    console.log(id)
    listMovie
    .deleteOne({ _id : id })
    .maxTimeMS(10000)
    .catch(error => {
      res.status(500).render("error", {
        message: "Error delete",
        error: error,
      });
    })
    res.redirect('/home')
  }

  put(req, res, next) {
    const data = req.body;
    const prevUrl = req.headers.referer;
    console.log(data.search)

    listMovie
      .insertMany({
        name: data.name,
        slug: data.slug,
        poster: data.poster,
        year: data.year,
      })
      .then(() => {
        res.redirect(prevUrl);
      })
      .catch((error) => {
        console.error(error);
        res.redirect(prevUrl);
      });

  }
}

module.exports = new HomeController();
