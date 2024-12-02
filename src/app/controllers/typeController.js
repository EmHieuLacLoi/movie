const mongoose = require("mongoose");
const slugify = require('slugify');
const { multipleMongooseToObject } = require("../../utils/mongoose.js");
const newMovie = require("../models/newMovie.js");
const link_img = "https://img.ophim.live/uploads/movies/";

class typeController {
    home(req, res, next) {
        const type = req.params.slug
        console.log(type)

        newMovie
        .find({ category: RegExp(`${type}`, "i") })
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
                res.render('type', { movie });
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
}

module.exports = new typeController()