const Promise = require('bluebird')
const { toPairs, fromPairs } = require('lodash')

module.exports = function(flags, opts){
  return Promise.resolve(flags)
  .then(toPairs)
  .each(validateFlag)
  .then(fromPairs)
  .return(opts)

  function validateFlag([key, value]){
    const opt = opts.find(o => o.name === key)

    if (opt && opt.validate){
      const valid = opt.validate(value)
      if (valid === true){
        return Promise.resolve()
      } else {
        return Promise.reject(new Error(`Invalid option: ${key} - ${valid}`))
      }
    } else {
      return Promise.resolve()
    }
  }

}
