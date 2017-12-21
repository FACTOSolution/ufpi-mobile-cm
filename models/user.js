const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.statics.authorize = function userAuthorizer(email, password, done) {
  User.findOne({ email })
    .exec((err, user) => {
      if (err) {
        return done(err)
      }

      if (!user) {
        return done(null, false)
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return done(err)
        }

        if (result !== true) {
          return done(null, result)
        }

        done(null, user)
      })
    })
}

UserSchema.pre('save', function hashPassword(done) {
  const user = this

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return done(err)
    }

    user.password = hash
    done()
  })
})

const User = mongoose.model('User', UserSchema)

module.exports = User