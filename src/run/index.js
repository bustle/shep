require('babel-register')

import path from 'path'

export default function({ name }){
  const func = require(path.join( process.cwd(), 'functions/' + name))
  const event = require(path.join( process.cwd(), 'functions/' + name, 'event.json'))
  const context = {
    succeed: function (res) {
      console.log('Success:')
      console.log(JSON.stringify(res, null, 2))
      process.exit(0)
    },
    fail: function (res) {
      console.log('Failure:')
      console.log(JSON.stringify(res, null, 2))
      process.exit(1)
    }
  }
  func.handler(event, context)
}
