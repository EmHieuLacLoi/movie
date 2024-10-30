const homeRouter = require('./home')
const movieRouter = require('./movie')
function route(app) {
    app.use('/', homeRouter)
    app.use('/movie', movieRouter)
}

module.exports = route