const express = require('express')
const passport = require('passport')
const Strategy = require('passport-http').BasicStrategy

const init = require('./db')
const User = require('./models/user')

const users = require('./routes/user')

const PORT = process.env.PORT
const app = express()

passport.use(new Strategy(User.authorize))

app.set('view engine', 'ejs')

app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (_, res) => res.render('index', { options: { hour: '2-digit', minute: '2-digit' } }))

app.use('/api', users)

app.get('/api/login', passport.authenticate('basic', { session: false }), (req, res) => {
  res.status(200).render('login', { userId: req.user._id, userEmail: req.user.email })
})

init(() => {
  app.listen(PORT, () => console.log(`listening on ${PORT}`))
})
