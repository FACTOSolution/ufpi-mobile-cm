const express = require('express')
const { isInt, toInt } = require('validator')

const Article = require('../models/article')
const { fetchPages } = require('../scraper')
const queue = require('../queue')

const router = express.Router()

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

  queue.enqueue(function updateArticles() {
    fetchPages(pages, start, (err, data) => {
      if (err) {
        return res.status(500).send(err.message)
      }

      Article.insertFromScraper(data, (err, docs) => {
        if (err) {
          return res.status(500).send(err.message)
        }

        res.status(200).json({ ok: true, added: docs.length })
      })
    })
  })
})

router.get('/articles', (req, res) => {
  let { limit = '10', skip = '0', sort = '0' } = req.query

  if (!isInt(limit)) {
    return res.status(400).send('Param `limit` must be an integer')
  }

  if (!isInt(skip)) {
    return res.status(400).send('Param `skip` must be an integer')
  }

  if (!isInt(sort)) {
    return res.status(400).send('Param `sort` must be an integer')
  }

  limit = toInt(limit)
  skip = toInt(skip)
  sort = toInt(sort)

  const today = new Date(Date.now())
  const dateFloor = (new Date()).setDate(today.getDate() - 25)

  const query = Article
    .find({ createdAt: { $gte: dateFloor } })
    .limit(limit)
    .skip(skip)

  if (sort < 0) {
    query.sort({ code: -1, createdAt: -1 })
  }

  query
    .select({ _id: 0, text: 0, __v: 0, updatedAt: 0 })
    .exec((err, data) => {
      if (err) {
        return res.status(500).send(err.message)
      }

      res.status(200).json(data)
    })
})

router.get('/articles/:code', (req, res) => {
  let { code } = req.params

  if (!code || !isInt(code)) {
    return res.status(400).send('URL param must be an integer')
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

module.exports = router
