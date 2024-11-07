const express = require('express')
const router = express.Router()

const noticeController = require('../app/controllers/noticeController.js');

router.get('/', noticeController.home)

module.exports = router