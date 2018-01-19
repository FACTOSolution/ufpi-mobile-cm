const express = require('express')
const passport = require('passport')
const { isInt, toInt } = require('validator')

const Calendar = require('../models/calendar')
const isValidOid = require('mongoose').Types.ObjectId.isValid

const router = express.Router()

/**
 * @swagger
 * /calendars:
 *  post:
 *    summary: 'Adiciona um novo calendário do usuário autenticado'
 *    security:
 *      - basicAuth: []
 *    tags:
 *      - 'calendários'
 *    parameters:
 *      -
 *        name: 'calendário'
 *        in: body
 *        description: 'O novo calendário que será adicionado'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/NewCalendar'
 *    responses:
 *      200:
 *        description: 'O calendário adicionado'
 *        schema:
 *          $ref: '#/definitions/Calendar'
 */
router.post('/calendars', passport.authenticate('basic', { session: false }), (req, res) => {
  const { title, kind, year, events } = req.body

  Calendar
    .create({
      title, kind, year, events,
      publisher: req.user._id
    })
    .then((calendar) => {
      const { title, year, events } = calendar
      res.status(200).json({ title, year, events })
    })
    .catch((err) => {
      res.status(500).send(err.message)
    })
})

/**
 * @swagger
 * /calendars/{id}:
 *  get:
 *    summary: 'Recupera uma lista de calendários de um usuário'
 *    tags:
 *      - 'calendários'
 *    parameters:
 *      - $ref: '#/parameters/pathUserId'
 *    responses:
 *      200:
 *        description: 'Uma lista de calendários'
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Calendar'
 */
router.get('/calendars/:publisher', (req, res) => {
  const { publisher } = req.params

  if (!isValidOid(publisher)) {
    return res.status(400).send('Invalid publisher id')
  }

  let { year = null, limit = '1', sort = '0' } = req.query

  if (year !== null && !isInt(year, { gt: 999, lt: 10000 })) {
    return res.status(400).send('Invalid `year`')
  }

  if (!isInt(limit, { min: 1, max: 4 })) {
    return res.status(400).send('Invalid `limit`')
  }

  limit = toInt(limit)

  if (!isInt(sort)) {
    return res.status(400).send('Invalid `sort`')
  }

  sort = toInt(sort) < 0 ? -1 : 1

  const query = Calendar.find({ publisher })

  if (year !== null) {
    query.where('year').lte(year)
  }

  query
    .sort({ createdAt: sort, year: sort })
    .select({ updatedAt: 0, publisher: 0 })
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(500).send(err.message)
      }

      res.status(200).json(data)
    })
})

/**
 * @swagger
 * /calendars/{id}/latest:
 *  get:
 *    summary: 'Recupera o calendário mais recente de um usuário'
 *    tags:
 *      - 'calendários'
 *    parameters:
 *      - $ref: '#/parameters/pathUserId'
 *    responses:
 *      200:
 *        description: 'Um calendário recente'
 *        schema:
 *          $ref: '#/definitions/Calendar'
 *        examples:
 *          application/json:
 *            $ref: '/api/examples/calendario.json'
 */
router.get('/calendars/:publisher/latest', (req, res) => {
  const { publisher } = req.params

  if (!isValidOid(publisher)) {
    return res.status(400).send('Invalid publisher id')
  }

  Calendar
    .findOne({ publisher })
    .sort({ year: -1, createdAt: -1 })
    .select({ updatedAt: 0, publisher: 0 })
    .exec((err, calendar) => {
      if (err) {
        return res.status(500).send(err.message)
      }

      res.status(200).json(calendar)
    })
})

module.exports = router
