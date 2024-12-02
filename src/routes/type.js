const express = require('express')
const router = express.Router()

const typeController = require('../app/controllers/typeController.js');

router.get('/:slug', typeController.home)

module.exports = router