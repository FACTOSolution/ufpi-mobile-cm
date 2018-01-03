function isValidDate(obj) {
  return (obj instanceof Date && isFinite(obj))
}

const dateStringFrom = (property) => {
  return function dateStringGetter() {
    return this[property] ? this[property].toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Fortaleza' }) : undefined
  }
}

const timeStringFrom = (property) => {
  return function timeStringGetter() {
    return this[property] ? this[property].toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Fortaleza' }) : undefined
  }
}

function deleteIdTransform(doc, ret, options) {
  delete ret.id
  delete ret._id
  return ret
}

function applyTransforms(...transforms) {
  return function transformChain(doc, ret, options) {
    const final = transforms.reduce((prev, curr, index) => {
      const result = curr(doc, prev, options)
      return result
    }, ret)

    return final
  }
}

module.exports = {
  isValidDate,
  dateStringFrom,
  timeStringFrom,
  applyTransforms,
  deleteIdTransform
}