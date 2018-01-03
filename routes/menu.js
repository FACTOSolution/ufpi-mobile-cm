const express = require('express')
const passport = require('passport')

const Menu = require('../models/menu')
const isValidDate = require('../util').isValidDate
const isValidOid = require('mongoose').Types.ObjectId.isValid

const router = express.Router()

/**
 * @swagger
 * /menus:
 *  post:
 *    summary: 'Adiciona um novo cardápio do usuário autenticado'
 *    security:
 *      - basicAuth: []
 *    tags:
 *      - 'cardápios'
 *    parameters:
 *      -
 *        name: 'cardápio'
 *        in: body
 *        description: 'O novo cardápio que será adicionado'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Menu'
 *    responses:
 *      200:
 *        description: 'O cardápio adicionado'
 *        schema:
 *          $ref: '#/definitions/Menu'
 */
router.post('/menus', passport.authenticate('basic', { session: false }), (req, res) => {
  const { monday, tuesday, wednesday, thursday, friday, saturday, startDate, endDate } = req.body

  Menu
    .create({
      monday, tuesday, wednesday, thursday, friday, saturday, startDate, endDate,
      publisher: req.user._id
    })
    .then((menu) => {
      const { monday, tuesday, wednesday, thursday, friday, saturday, startDate, endDate } = menu
      res.status(200).json({ monday, tuesday, wednesday, thursday, friday, saturday, startDate, endDate })
    })
    .catch((err) => {
      res.status(500).send(err.message)
    })
})

/**
 * @swagger
 * /menus/{id}:
 *  get:
 *    summary: 'Recupera uma lista de cardápios de um usuário'
 *    tags:
 *      - 'cardápios'
 *    parameters:
 *      - $ref: '#/parameters/pathUserId'
 *    responses:
 *      200:
 *        description: 'Uma lista de cardápios'
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Menu'
 */
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

  query.select({ createdAt: 0, updatedAt: 0, _id: 0, publisher: 0, '__v': 0 })

  query.limit(limit).exec((err, data) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    res.status(200).json(data)
  })
})

/**
 * @swagger
 * /menus/{id}/latest:
 *  get:
 *    summary: 'Recupera o cardápio mais recente de um usuário'
 *    tags:
 *      - 'cardápios'
 *    parameters:
 *      - $ref: '#/parameters/pathUserId'
 *    responses:
 *      200:
 *        description: 'Um cardápio recente'
 *        schema:
 *          $ref: '#/definitions/Menu'
 *        examples:
 *          application/json:
 *            $ref: '/api/examples/cardapio.json'
 */
router.get('/menus/:publisher/latest', (req, res) => {
  const { publisher } = req.params

  if (!isValidOid(publisher)) {
    return res.status(400).send('Invalid publisher id')
  }

  Menu
    .findOne({ publisher })
    .sort({ startDate: -1 })
    .select({ createdAt: 0, updatedAt: 0, _id: 0, publisher: 0, '__v': 0 })
    .exec((err, menu) => {
      if (err) {
        return res.status(500).send(err.message)
      }

      res.status(200).json(menu)
    })
})

module.exports = router
