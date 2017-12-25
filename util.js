exports.isValidDate = function(obj) {
  return (obj instanceof Date && isFinite(obj))
}
