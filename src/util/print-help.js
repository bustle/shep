const { kebabCase, padEnd } = require('lodash')
const Promise = require('bluebird')

module.exports = function(helpText, opts){
  console.log('')
  console.log(helpText)
  console.log('')
  console.log('Options:')
  console.log('')
  opts.map((opt)=>{
    const flag = padEnd(`--${kebabCase(opt.name)}`, 25)
    console.log(`${flag}${opt.message}`)
  })

  return Promise.resolve()
}
