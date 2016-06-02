export function index(){
  return `exports.handler = function(event, context, callback) {
  // Replace below with your own code!
  console.log(event)
  console.log(context)

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
