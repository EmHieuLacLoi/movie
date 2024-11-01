require('dotenv').config()
const mongoose = require('mongoose')

async function connect(dbName) {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri, {
            dbName: dbName,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`Connected to database: ${dbName}`);
        return mongoose.connection;
    } catch (e) {
        console.log('Connect false! ',e)
    }
}

module.exports = { connect };