const express = require('express')
const passport = require('passport')

const Menu = require('../models/menu')

const router = express.Router()

router.get('/menus', (req, res) => {
  Menu.find({}).select('-__v').exec((err, data) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    res.status(200).json(data)
  })
})

router.get('/menus/latest', (req, res) => {
  const { userId, startDate } = req.query

  if (userId === undefined || startDate === undefined) {
    return res.status(400).send('Bad request. Missing required `userId` and `startDate` query.')
  }

  Menu
    .findOne({ publisher: userId, startDate: {$lte: new Date(startDate)} })
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
  
  Menu.create({
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
