const homeRouter = require('./home')
const movieRouter = require('./movie')
const noticeRouter = require('./notice')
const typeRouter = require('./type')
const signInRouter = require('./signin')
const signUpRouter = require('./signup')
function route(app) {
    app.use('/', homeRouter)
    app.use('/home', homeRouter)

    app.use('/signin', signInRouter)
    app.use('/signup', signUpRouter)
    app.use('/movie', movieRouter)
    app.use('/notice', noticeRouter)
    app.use('/type', typeRouter)

    // Middleware bắt lỗi 404 và chuyển tiếp đến middleware xử lý lỗi
    app.use((req, res, next) => {
        const err = new Error('Page Not Found');
        err.status = 404;
        next(err);
    });
    
    // Middleware xử lý lỗi
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
        status: err.status || 500,
        message: err.message
        });
    });
      
}

module.exports = route