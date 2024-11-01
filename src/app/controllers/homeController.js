const mongoose = require('mongoose');

// Configure global mongoose settings
mongoose.set('debug', true); // Enable debug logging
mongoose.set('bufferTimeoutMS', 30000); // Increase buffer timeout to 30 seconds

const listMovie = require("../models/listMovie.js");
const { multipleMongooseToObject } = require('../../utils/mongoose.js');

class HomeController {
  home(req, res, next) {
    // Add more robust error handling
    listMovie.find({})
      .maxTimeMS(10000) // Set maximum query time
      .then((movie) => {
        if (!movie || movie.length === 0) {
          console.warn('No movies found');
          return res.render('home', { movie: [] });
        }
        
        movie = multipleMongooseToObject(movie)
        res.render('home', { movie })
      })
      .catch((error) => {
        console.error('Database Query Error:', {
          message: error.message,
          name: error.name,
          code: error.code,
        });
        
        // Send error response
        res.status(500).render('error', { 
          message: 'Unable to fetch movies',
          error: error 
        });
        
        // Pass to error handling middleware
        next(error);
      });
  }
}

module.exports = new HomeController();