require('babel-register')

const path = require('path')

module.exports = function(opts){
  const func = require(path.join( process.cwd(), 'functions/' + opts.name))
  const event = require(path.join( process.cwd(), 'functions/' + opts.name, 'event.json'))
  const context = {
    succeed: function (res) {
      console.log('Success:')
      console.log(JSON.stringify(res, null, 2))
      process.exit(0)
    },
    fail: function (res) {
      console.log('Failure:')
      throw(res)
      process.exit(1)
    }
  }
  func.handler(event, context)
}
