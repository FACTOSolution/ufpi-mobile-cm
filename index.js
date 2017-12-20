const express = require('express')

const app = express()

const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')

app.get('/', (_, res) => res.render('index', { options: { hour: '2-digit', minute: '2-digit' } }))

app.listen(PORT, () => console.log(`listening on ${PORT}`))
