const express = require('express')
const passport = require('passport')

const Menu = require('../models/menu')
const isValidDate = require('../util').isValidDate
const isValidOid = require('mongoose').Types.ObjectId.isValid

const router = express.Router()

router.get('/menus/:publisher', (req, res) => {
  const { publisher } = req.params

  if (!isValidOid(publisher)) {
    return res.status(400).send('Invalid publisher id')
  }

  let { startDate, limit, sort } = req.query

  startDate = new Date(startDate)
  if (!isValidDate(startDate)) {
    startDate = null
  }

  if (isNaN(limit)) {
    limit = 10
  } else {
    limit = parseInt(limit)
  }

  sort = (sort === 'asc' ? 1 : (sort === 'des' ? -1 : null))

  const query = Menu.find({ publisher })

  if (startDate) {
    query.where('startDate').lte(startDate)
  }

  if (sort) {
    query.sort({ startDate: sort })
  }

  query.limit(limit).exec((err, data) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    res.status(200).json(data)
  })
})

router.get('/menus/:publisher/latest', (req, res) => {
  const { publisher } = req.params

  if (!isValidOid(publisher)) {
    return res.status(400).send('Invalid publisher id')
  }

  Menu
    .findOne({ publisher })
    .sort({ startDate: -1 })
    .exec((err, menu) => {
      if (err) {
        return res.status(500).send(err.message)
      }

      res.status(200).json(menu)
    })
})

router.post('/menus', passport.authenticate('basic', { session: false }), (req, res) => {
  const { monday, tuesday, wednesday, thursday, friday, saturday, startDate, endDate } = req.body

  Menu
    .create({
      monday, tuesday, wednesday, thursday, friday, saturday, startDate, endDate,
      publisher: req.user._id
    })
    .then((menu) => {
      res.status(200).json(menu)
    })
    .catch((err) => {
      res.status(500).send(err.message)
    })
})

module.exports = router
