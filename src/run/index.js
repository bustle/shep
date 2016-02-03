require('babel-register')

import prompt from '../util/prompt'
import glob from 'glob'
import path from 'path'

export default function(){
  const funcNames = glob.sync('functions/*/').map((dir) => dir.split('/').slice(-2, -1)[0] )

  return prompt([
    {
      name: 'funcName',
      type: 'list',
      choices: funcNames,
      message: 'Which lambda function?'
    }
  ])
  .then((params)=>{
    return run(params)
  })

  function run({funcName}) {
    const func = require(path.join( process.cwd(), 'functions/' + funcName))
    const event = require(path.join( process.cwd(), 'functions/' + funcName, 'event.json'))
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
}
