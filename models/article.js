const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  code: { type: Number, unique: true },
  titulo: { type: String, required: true },
  href: { type: String, required: true },
  _data: String,
  hora: String,
  text: [String],
}, { timestamps: true })

ArticleSchema.statics.insertFromScraper = function(json, done) {
  json.forEach((doc) => {
    doc.text = doc.text.filter(p => p.length > 0)
  })

  const newCodes = json.map(doc => doc.code)

  this
    .find({})
    .where('code')
    .in(newCodes)
    .select('code')
    .then((articles) => {
      const prevCodes = articles.map(a => a.code)

      const newDocs = json
        .filter(d => !prevCodes.includes(d.code))
        .map(v => {
          v['titulo'] = v.title
          v['href'] = v.link
          v['_data'] = v.date
          v['hora'] = v.time

          let t = v.time.split('h')
          let d = v.date.split('/')

          let b = new Date('2000-01-01T00:00:00-03:00')
          b.setFullYear(2000 + Number(d[2]), Number(d[1]) - 1, Number(d[0]))
          b.setHours(Number(t[0]))
          b.setMinutes(Number(t[1]))

          v.createdAt = b

          delete v.title
          delete v.link
          delete v.date
          delete v.time

          return v
        })

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
