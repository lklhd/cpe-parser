const cpe = require('./cpe')
const evaluate = require('./evaluate')

module.exports = {
  parse: cpe.parse,
  evaluate: evaluate(cpe.parse)
}
