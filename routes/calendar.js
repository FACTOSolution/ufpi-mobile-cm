const express = require('express')
const passport = require('passport')

const Calendar = require('../models/calendar')
const isValidDate = require('../util').isValidDate
const isValidOid = require('mongoose').Types.ObjectId.isValid

const router = express.Router()

router.get('/calendars/:publisher', (req, res) => {
  const { publisher } = req.params

  if (!isValidOid(publisher)) {
    return res.status(400).send('Invalid publisher id')
  }

  let { year, limit, sort } = req.query

  const startDate = new Date()
  startDate.setFullYear(year)
  if (!isValidDate(startDate)) {
    year = null
  }

  if (isNaN(limit)) {
    limit = 10
  } else {
    limit = parseInt(limit)
  }

  sort = (sort === 'asc' ? 1 : (sort === 'des' ? -1 : null))

  const query = Calendar.find({ publisher })

  if (year) {
    query.where('year').lte(year)
  }

  if (sort) {
    query.sort({ createdAt: sort })
  }

  query.limit(limit).exec((err, data) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    res.status(200).json(data)
  })
})

router.get('/calendars/:publisher/latest', (req, res) => {
  const { publisher } = req.params

  if (!isValidOid(publisher)) {
    return res.status(400).send('Invalid publisher id')
  }

  Calendar
    .findOne({ publisher })
    .sort({ year: -1, createdAt: -1 })
    .exec((err, calendar) => {
      if (err) {
        return res.status(500).send(err.message)
      }

      res.status(200).json(calendar)
    })
})

router.post('/calendars', passport.authenticate('basic', { session: false }), (req, res) => {
  const { title, year, events } = req.body

  Calendar
    .create({
      title, year, events,
      publisher: req.user._id
    })
    .then((calendar) => {
      res.status(200).json(calendar)
    })
    .catch((err) => {
      res.status(500).send(err.message)
    })
})

module.exports = router
