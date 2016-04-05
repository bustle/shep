const Promise = require('bluebird')
const { kebabCase } = require('lodash')

module.exports = function (prompts){
  const missingFlags = prompts.map(opt => `--${kebabCase(opt.name)}`).join(', ')
  return Promise.reject(new Error(`Missing flags: ${missingFlags}`))
}
