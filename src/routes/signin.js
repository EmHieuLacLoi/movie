const express = require('express')
const router = express.Router()

const signInController = require('../app/controllers/signInController');

router.get('/', signInController.home)
router.post('/', signInController.signIn)
module.exports = router