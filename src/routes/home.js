const express = require('express')
const router = express.Router()

const homeController = require('../app/controllers/homeController');

router.get('/search', homeController.search)
router.get('/new-movie', homeController.show)
router.post('/new-movie', homeController.update)
router.put('/add-shortcut', homeController.put)
router.delete('/:id', homeController.delete)
router.get('/', homeController.home)

module.exports = router