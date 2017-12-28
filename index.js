const express = require('express')
const logger = require('morgan')
const passport = require('passport')
const Strategy = require('passport-http').BasicStrategy

const init = require('./db')
const User = require('./models/user')

const users = require('./routes/user')
const menus = require('./routes/menu')
const calendars = require('./routes/calendar')
const articles = require('./routes/article')

const PORT = process.env.PORT

const app = express()

passport.use(new Strategy(User.authorize))

app.set('view engine', 'ejs')

app.use(passport.initialize())

if (process.env.NODE_ENV == 'development') {
  app.use(logger('dev'))
}
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (_, res) => res.render('index', { options: { hour: '2-digit', minute: '2-digit' } }))

app.use('/api', users)
app.use('/api', menus)
app.use('/api', calendars)
app.use('/api', articles)

app.get('/api/login', passport.authenticate('basic', { session: false }), (req, res) => {
  res.status(200).render('login', { userId: req.user._id, userEmail: req.user.email })
})

init(() => {
  const server = app.listen(PORT, () => {
    const props = server.address()

    console.debug(`[${process.env.NODE_ENV}] listening to ${props.address} on port ${props.port}`)
  })

  const closeServer = function() {
    server.close(() => {
      console.log('connections closed')
      process.exit(0)
    })

    setTimeout(() => {
      console.log('shutting down')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', closeServer)
  process.on('SIGINT', closeServer)
})
