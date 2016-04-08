require('babel-register')

const path = require('path')

module.exports = function(opts){
  const func = require(path.join( process.cwd(), 'functions/' + opts.name))
  const event = require(path.join( process.cwd(), 'functions/' + opts.name, 'event.json'))
  const context = {}

  const callback = function(err, res){
    if (err) {
      console.log('ERROR!')
      throw(err)
    } else {
      console.log(JSON.stringify(res, null, 2))
      process.exit(0)
    }
  }
  func.handler(event, context, callback)
}
