const express = require('express')
const User = require('../models/user')

const router = express.Router()

/**
 * @swagger
 * /users:
 *  post:
 *    summary: 'Cria um novo usuário da API'
 *    tags:
 *      - 'usuários'
 *    parameters:
 *      -
 *        name: 'usuário'
 *        in: body
 *        description: 'O novo usuário que será adicionado'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/NewUser'
 *    responses:
 *      200:
 *        description: 'O usuário adicionado'
 *        schema:
 *          $ref: '#/definitions/User'
 */
router.post('/users', (req, res) => {
  User.create({
    email: req.body.email,
    password: req.body.password,
    kind: req.body.kind
  })
    .then((user) => {
      res.status(200).json({ id: user._id, email: user.email, kind: user.kind })
    })
    .catch((err) => {
      res.status(500).send(err.message)
    })
})

/**
 * @swagger
 * /users:
 *  get:
 *    summary: 'Recupera uma lista de usuários'
 *    tags:
 *      - 'usuários'
 *    responses:
 *      200:
 *        description: 'Uma lista de usuários'
 *        schema:
 *          type: 'array'
 *          items:
 *            $ref: '#/definitions/User'
 */
router.get('/users', (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    res.status(200).json(data.map((user) => {
      const { _id, email, kind } = user
      return { id: _id, email, kind }
    }))
  })
})

module.exports = router
