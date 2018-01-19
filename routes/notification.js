const express = require('express')
const passport = require('passport')
const { isInt, toInt } = require('validator')
const Notification = require('../models/notification')
const isValidOid = require('mongoose').Types.ObjectId.isValid

const router = express.Router()

/**
 * @swagger
 * /notifications:
 *  post:
 *    summary: 'Adiciona uma nova notificação do usuário autenticado'
 *    security:
 *      - basicAuth: []
 *    tags:
 *      - 'notificações'
 *    parameters:
 *      -
 *        name: 'notificação'
 *        in: body
 *        description: 'A nova notificação que será adicionada'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/NewNotification'
 *    responses:
 *      200:
 *        description: 'A notificação adicionada'
 *        schema:
 *          $ref: '#/definitions/Notification'
 */
router.post('/notifications', passport.authenticate('basic', { session: false }), (req, res) => {
  const { title, location, startDate } = req.body

  Notification
    .create({
      title, location, startDate,
      publisher: req.user._id
    })
    .then((notification) => {
      res.status(200).json(notification)
    })
    .catch((err) => {
      res.status(500).send(err.message)
    })
})

/**
 * @swagger
 * /notifications/{id}:
 *  get:
 *    summary: 'Recupera uma lista de notificações de um usuário'
 *    tags:
 *      - 'notificações'
 *    parameters:
 *      - $ref: '#/parameters/pathUserId'
 *    responses:
 *      200:
 *        description: 'Uma lista de notificações'
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Notification'
 */
router.get('/notifications/:publisher', (req, res) => {
  const { publisher } = req.params

  if (!isValidOid(publisher)) {
    return res.status(400).send('Invalid publisher id')
  }

  let { limit = '10', skip = '0', sort = '-1' } = req.query

  if (!isInt(limit)) {
    return res.status(400).send('Param `limit` must be an integer')
  }

  if (!isInt(skip)) {
    return res.status(400).send('Param `skip` must be an integer')
  }

  if (!isInt(sort, { min: -1, max: 1 })) {
    return res.status(400).send('Param `sort` must be an integer [-1, 1]')
  }

  limit = toInt(limit)
  skip = toInt(skip)
  sort = toInt(sort)

  const dateFloor = new Date(Date.now())
  const day = dateFloor.getDate()
  dateFloor.setDate(day - 25)

  const query = Notification.find({ createdAt: { $gte: dateFloor } })

  if (sort !== 0) {
    query.sort({ createdAt: sort })
  }

  query
    .skip(skip)
    .limit(limit)
    .select({ updatedAt: 0 })
    .exec((err, data) => {
      if (err) {
        console.error(err.stack)
        return res.status(500).send(err.message)
      }

      res.status(200).json(data)
    })
})

module.exports = router
