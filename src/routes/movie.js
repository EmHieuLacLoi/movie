const express = require('express')
const router = express.Router()

const movieController = require('../app/controllers/movieController');

router.get('/:slug', movieController.show)

module.exports = router