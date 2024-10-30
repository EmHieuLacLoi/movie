const mongoose = require('mongoose')

async function connect(dbName) {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`)
    } catch (e) {
        console.log('Connect false! ',e)
    }
}

module.exports = { connect };