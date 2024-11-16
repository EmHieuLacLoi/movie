class typeController {
    home(req, res, next) {
        res.render('type')
    }
}

module.exports = new typeController()