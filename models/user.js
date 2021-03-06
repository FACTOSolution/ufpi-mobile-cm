const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

/**
 * @swagger
 * parameters:
 *  pathUserId:
 *    in: path
 *    name: id
 *    required: true
 *    type: string
 *    format: uuid
 *    description: Identificador de um usuário cadastrado
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *        format: uuid
 *      email:
 *        type: string
 *        format: email
 *      kind:
 *        type: string
 *        enum: [RU, CAL, EVEN] 
 *        default: RU
 *  NewUser:
 *    type: object
 *    properties:
 *      email:
 *        type: string
 *        format: email
 *      password:
 *        type: string
 *        format: password
 *      kind:
 *        type: string
 *        enum: [RU, CAL, EVEN]
 *        default: RU
 *    required:
 *      - email
 *      - password
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    required: true,
    enum: ['RU','CAL','EVEN'],
    default: 'RU'
  }
}, { timestamps: true })

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

  if (!user.isModified('password')) {
    return done()
  }

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
