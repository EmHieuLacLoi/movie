const express = require('express')
const router = express.Router()

const movieController = require('../app/controllers/movieController');

router.get('/:slug', movieController.show)
router.get('/watch/:slug', movieController.watch)
module.exports = router