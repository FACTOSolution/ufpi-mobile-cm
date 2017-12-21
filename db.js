const mongoose = require('mongoose')

const URI = process.env.MONGODB_URI

module.exports = function init(done) {
  mongoose.Promise = global.Promise

  mongoose.connect(URI, { useMongoClient: true }, done)
}
