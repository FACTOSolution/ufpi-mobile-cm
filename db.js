const mongoose = require('mongoose')

const URI = process.env.MONGODB_URI

module.exports = mongoose.connect(URI)
