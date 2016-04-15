require('babel-register')

const path = require('path')
const Promise = require('bluebird')

module.exports = function(opts){
  return new Promise((resolve, reject) => {
    global.env = require(path.join( process.cwd(), 'config/development.json'))

    const func = require(path.join( process.cwd(), 'functions/' + opts.name))
    const event = require(path.join( process.cwd(), 'functions/' + opts.name, 'event.json'))
    const context = {}

    const callback = function(err, res){
      if (err) {
        if (opts.silent !== true) { console.log('ERROR!') }
        return reject(err)
      } else {
        if (opts.silent !== true) { console.log(JSON.stringify(res, null, 2)) }
        return resolve(res)
      }
    }

    func.handler(event, context, callback)
    setTimeout(()=>{
      func.handler(event, context, callback)
    },2000)
  })
}
