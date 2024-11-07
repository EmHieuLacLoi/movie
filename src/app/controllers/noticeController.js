class noticeController {
    home(req, res, next) {
        res.render('notice')
    }
}

module.exports = new noticeController()