export function index(){
  return `const config = require('shep-config')

exports.handler = function(event, context, callback) {
  // Replace below with your own code!
  console.log(event)
  console.log(context)
  console.log(config)

  callback(null, 'success!')
}`
}

export function event(){
  let obj = {
    headers: {},
    pathParameters: {},
    queryParameters: {},
    body: {}
  }

  return JSON.stringify(obj, null, 2)
}

export function lambda(name){
  let obj = {
    FunctionName: name
  }

  return JSON.stringify(obj, null, 2)
}
