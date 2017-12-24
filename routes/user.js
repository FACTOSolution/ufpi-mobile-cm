const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.post('/users', (req, res) => {
  User.create({
    email: req.body.email,
    password: req.body.password
  })
  .then((user) => {
    res.status(200).json({ id: user._id, email: user.email })
  })
  .catch((err) => {
    res.status(500).send(err.message)
  })
})

router.get('/users', (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    res.status(200).json(data.map((user) => {
      const { _id, email } = user
      return { id: _id, email }
    }))
  })
})

module.exports = router
