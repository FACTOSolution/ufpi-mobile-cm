const express = require('express')
const session = require('express-session')
const { join } = require('path')
const logger = require('morgan')
const apiDocs = require('swagger-jsdoc')
const apiUI = require('swagger-ui-express')
const passport = require('passport')
const { BasicStrategy } = require('passport-http')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const httpErrorPages = require('http-error-pages');

const init = require('./db')
const User = require('./models/user')

const users = require('./routes/user')
const menus = require('./routes/menu')
const calendars = require('./routes/calendar')
const articles = require('./routes/article')
const notifications = require('./routes/notification')
const admin = require('./routes/admin');

const { PORT, HOSTURL } = process.env

const app = express()

const apiSpec = apiDocs({
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: 'UFPI mobile support API',
      version: '1.0.0',
      description: 'A API web de suporte do UFPI Mobile permite a busca de informações sobre o **cardápio** do restaurante universitário, os eventos do **calendário** acadêmico e as últimas **notícias** no website da UFPI.'
    },
    consumes: ['application/x-www-form-urlencoded', 'application/json'],
    securityDefinitions: {
      basicAuth: {
        type: 'basic'
      }
    },
    tags: [{
      name: 'notícias',
      description: 'Notícias'
    }, {
      name: 'calendários',
      description: 'Calendários'
    }, {
      name: 'cardápios',
      description: 'Cardápios'
    }, {
      name: 'usuários',
      description: 'Usuários'
    }],
    basePath: '/api'
  },
  apis: ['./routes/*.js', './models/*.js']
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Passport Configuration

// Passport Basic Strategy for API Endpoints
passport.use(new BasicStrategy(User.authorize))

// Passport Local Strategy for Admin Auth
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, User.authorize))

// Passport serializer and deserializer functions
passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(_id, done) {
  User.findById(_id)
    .exec((err, user) => {
      done(err, user)
    })
})

app.use(session({ 
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// Using express to serve static files
app.use(express.static('static'))

app.set('view engine', 'ejs')

// Add Http Error Pages default
httpErrorPages.express(app, {
  lang: 'pt_BR',
  footer: 'UFPI MOBILE'
})

if (process.env.NODE_ENV == 'development') {
  app.use(logger('short'))
}

// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

app.get('/', (_, res) => res.render('index', { options: { hour: '2-digit', minute: '2-digit' } }))

app.get('/api/spec.json', (_, res) => res.json(apiSpec))

const specURL = `${HOSTURL}${apiSpec.basePath}/spec.json`

app.use('/docs', apiUI.serve, apiUI.setup(null, { swaggerUrl: specURL }))

app.use('/admin', admin);

app.use('/api/examples', express.static(join(__dirname, 'examples')))
app.use('/api', users)
app.use('/api', menus)
app.use('/api', calendars)
app.use('/api', articles)
app.use('/api', notifications)

app.get('/api/login', passport.authenticate('basic', { session: false }), (req, res) => {
  res.status(200).render('login', { userId: req.user._id, userEmail: req.user.email })
})

init.then(() => {
  const server = app.listen(PORT, () => {
    const props = server.address()

    console.debug(`[${process.env.NODE_ENV}] listening to ${props.address} on port ${props.port}`)
  })

  const closeServer = function () {
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
