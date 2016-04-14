module.exports = function(){
  let obj = {
    headers: {},
    pathParameters: {},
    queryParameters: {},
    body: {}
  }

  return JSON.stringify(obj, null, 2)
}
