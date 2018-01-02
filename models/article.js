const mongoose = require('mongoose')

/**
 * @swagger
 * definitions:
 *  Article:
 *    type: object
 *    properties:
 *      code:
 *        type: integer
 *      titulo:
 *        type: string
 *      href:
 *        type: string
 *        format: uri
 *      _data:
 *        type: string
 *        format: date
 *      hora:
 *        type: string
 *      text:
 *        type: array
 *        items:
 *          type: string
 *      images:
 *        type: array
 *        items:
 *          type: string
 *          format: uri
 *      links:
 *        type: array
 *        items:
 *          type: string
 *          format: uri
 *      createdAt:
 *        type: string
 *        format: date-time
 *    required:
 *      - code
 *      - titulo
 *      - href
 */
const ArticleSchema = new mongoose.Schema({
  code: { type: Number, unique: true },
  titulo: { type: String, required: true },
  href: { type: String, required: true },
  _data: String,
  hora: String,
  text: [String],
  images: [String],
  links: [String]
}, { timestamps: true })

ArticleSchema.statics.insertFromScraper = function (result, done) {
  result.forEach((v) => {
    v.code = Number(v.link.match(/\d+/)[0])
    v.text = v.data.text.filter(p => p.length > 0)
    v.links = v.data.links.filter(p => p.length > 0)
    v.images = v.data.images.filter(p => p.length > 0)

    const time = v.time.split('h')
    const date = v.date.split('/')
    const dateTime = new Date('2000-01-01T00:00:00-03:00')

    dateTime.setFullYear(2000 + Number(date[2]), Number(date[1]) - 1, Number(date[0]))
    dateTime.setHours(Number(time[0]))
    dateTime.setMinutes(Number(time[1]))

    v.createdAt = dateTime

    v['titulo'] = v.title
    v['href'] = v.link
    v['_data'] = v.date
    v['hora'] = v.time

    delete v.title
    delete v.link
    delete v.date
    delete v.time
    delete v.data
  })

  const newCodes = result.map(v => v.code)

  this.find({
    code: { $in: newCodes }
  }).select('code')
    .then((articles) => {
      const currCodes = articles.map(v => v.code)

      const newDocs = result
        .filter(v => !currCodes.includes(v.code))

      this.insertMany(newDocs, (err, added) => {
        if (err) {
          return done(err)
        }

        done(null, added)
      })
    })
    .catch(done)
}

module.exports = mongoose.model('Article', ArticleSchema)
