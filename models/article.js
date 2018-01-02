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
  title: { type: String, required: true, alias: 'titulo' },
  address: { type: String, required: true, alias: 'href' },
  text: [String],
  images: [String],
  links: [String]
}, { timestamps: true })

ArticleSchema.virtual('_data').get(function virtualData() {
  return this.createdAt.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Fortaleza' })
})

ArticleSchema.virtual('hora').get(function virtualHora() {
  return this.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Fortaleza' })
})

ArticleSchema.set('toJSON', { virtuals: true, getters: false, versionKey: false })

if (!ArticleSchema.options.toJSON) {
  ArticleSchema.options.toJSON = {}
}

ArticleSchema.options.toJSON.transform = function jsonTransform(doc, ret, options) {
  delete ret.id
  delete ret._id
  delete ret.title
  delete ret.address
  delete ret.updatedAt

  return ret
}

ArticleSchema.statics.insertFromScraper = function (result, done) {
  result.forEach((v) => {
    v.code = Number(v.link.match(/\d+/)[0])
    v.text = v.data.text.filter(p => p.length > 0)
    v.links = v.data.links.filter(p => p.length > 0)
    v.images = v.data.images.filter(p => p.length > 0)

    const time = v.timeStr.split('h')
    const date = v.dateStr.split('/')
    const dateTime = new Date('2000-01-01T00:00:00-03:00')

    dateTime.setFullYear(2000 + Number(date[2]), Number(date[1]) - 1, Number(date[0]))
    dateTime.setHours(Number(time[0]))
    dateTime.setMinutes(Number(time[1]))

    v.createdAt = dateTime

    delete v.data
    delete v.dateStr
    delete v.timeStr
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
