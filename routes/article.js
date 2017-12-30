const express = require('express')
const { isInt, toInt } = require('validator')

const Article = require('../models/article')
const { fetchPages } = require('../scraper')
const queue = require('../queue')

const router = express.Router()

/**
 * @swagger
 * /articles:
 *  get:
 *    summary: 'Recupera uma lista de notícias'
 *    tags:
 *      - 'notícias'
 *    responses:
 *      200:
 *        description: 'Uma lista de notícias'
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Article'
 */
router.get('/articles', (req, res) => {
  let { limit = '10', skip = '0', sort = '0' } = req.query

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

  const today = new Date(Date.now())
  const dateFloor = (new Date()).setDate(today.getDate() - 25)

  const query = Article.find({ createdAt: { $gte: dateFloor } })

  if (sort !== 0) {
    query.sort({ createdAt: sort })
  }

  query
    .skip(skip)
    .limit(limit)
    .select({ _id: 0, __v: 0, updatedAt: 0, text: 0, links: 0, images: 0 })
    .exec((err, data) => {
      if (err) {
        return res.status(500).send(err.message)
      }

      res.status(200).json(data)
    })
})

/**
 * @swagger
 * /articles/{code}:
 *  get:
 *    summary: 'Recupera uma notícia específica'
 *    tags:
 *      - 'notícias'
 *    parameters:
 *      -
 *        name: 'code'
 *        in: path
 *        description: 'Código de uma notícia'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Article/properties/code'
 *    responses:
 *      200:
 *        description: 'Uma notícia completa'
 *        schema:
 *          $ref: '#/definitions/Article'
 */
router.get('/articles/:code', (req, res) => {
  let { code } = req.params

  if (!code || !isInt(code)) {
    return res.status(400).send('URL `code` param must be an integer')
  }

  code = toInt(code)

  Article
    .findOne({ code })
    .select({ _id: 0, __v: 0, updatedAt: 0 })
    .exec((err, article) => {
      if (err) {
        return res.status(500).send(err.message)
      }

      res.status(200).json(article)
    })
})

/**
 * @swagger
 * /articles/update:
 *  get:
 *    summary: 'Requisita a atualização das notícias na API'
 *    tags:
 *      - 'notícias'
 *    responses:
 *      200:
 *        description: 'Uma mensagem de estado'
 *        schema:
 *          type: object
 *          properties:
 *            ok:
 *              type: boolean
 *            message:
 *              type: string
 *            added:
 *              type: integer
 *          required:
 *            - ok
 */
router.get('/articles/update', (req, res) => {
  let { pages = '1', start = '0' } = req.query

  if (!isInt(pages)) {
    return res.status(400).send('Param `pages` must be an integer')
  }

  if (!isInt(start)) {
    return res.status(400).send('Param `start` must be an integer')
  }

  pages = toInt(pages)
  start = toInt(start)

  if (queue.paused === true) {
    res
      .status(200)
      .json({
        ok: true,
        message: 'Update request added to queue'
      })
  }

  queue.enqueue(function updateArticles() {
    fetchPages(pages, start, (err, data) => {
      if (err) {
        if (!res.headersSent) {
          return res.status(500).send(err.message)
        }
      }

      Article.insertFromScraper(data, (err, docs) => {
        if (err) {
          if (!res.headersSent) {
            return res.status(500).send(err.message)
          }
        }

        if (!res.headersSent) {
          res.status(200).json({ ok: true, added: docs.length })
        }
      })
    })
  })
})

module.exports = router
