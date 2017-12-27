const XRay = require('x-ray')
const { URL, URLSearchParams } = require('url')

const Article = require('./models/article')

const baseURL = process.env.NEWS_BASE_URL
const baseParams = new URLSearchParams({
  tmpl: 'component',
  print: 1
})

const x = XRay({
  filters: {
    trim: (v) => typeof v === 'string' ? v.trim() : v,
    getCode: (v) => typeof v === 'string' ? v.match(/\d+/)[0] : v,
    toNumber: (v) => typeof v === 'string' ? Number(v) : v,
    append: (v, s) => typeof v === 'string' ? v.concat(s) : v
  }
})

function fetchPages(numberOfPages = 1, startPage = 0, done) {
  const params = new URLSearchParams(baseParams)

  if (typeof startPage === 'number' && startPage > 0) {
    params.append('start', Math.floor(startPage * 10))
  }

  const url = new URL(baseURL)
  url.search = params

  x(url.toString(), '.tileItem', [{
    code: '.tileHeadline a@href | getCode | toNumber',
    title: '.tileHeadline a | trim',
    link: '.tileHeadline a@href',
    date: '.tileInfo li:nth-child(3) | trim',
    time: '.tileInfo li:nth-child(4) | trim',
    text: x(`.tileHeadline a@href | append:?${params}`, [
      '.item-page p | trim'
    ])
  }])
    .paginate('.pagination-next a@href')
    .limit(numberOfPages)(done)
}

exports.fetchPages = fetchPages
