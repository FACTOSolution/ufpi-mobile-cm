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
    append: (v, s) => typeof v === 'string' ? v.concat(s) : v
  }
})

function fetchPages(numberOfPages = 1, startPage = 0, done = (_) => void (0)) {
  const params = new URLSearchParams(baseParams)

  if (typeof startPage === 'number' && startPage > 0) {
    params.append('start', Math.floor(startPage * 10))
  }

  const url = new URL(baseURL)
  url.search = params

  x(url.toString(), '.tileItem', [{
    title: '.tileHeadline a | trim',
    address: '.tileHeadline a@href',
    dateStr: '.tileInfo li:nth-child(3) | trim',
    timeStr: '.tileInfo li:nth-child(4) | trim',
    data: x(`.tileHeadline a@href | append:?${baseParams}`, {
      text: ['.item-page p | trim'],
      images: ['.item-page a ~ p img@src'],
      links: ['.item-page a ~ p a@href']
    })
  }])
    .paginate('.pagination-next a@href')
    .limit(numberOfPages)(replaceTags)(done)
}

function replaceTags(err, data) {
  data.forEach(element => {
    element.data.hrefs.forEach((href, linkIndex) => {
      var line = element.data.text.filter(l => { return l.includes(href) });
      var index = element.data.text.indexOf(line.pop());
      element.data.text[index] = element.data.text[index]
        .replace(href,"<a href=" + element.data.links[linkIndex] + ">" + href + "</a>");
    })
  });
}

exports.fetchPages = fetchPages
