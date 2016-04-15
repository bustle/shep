module.exports = function(){
  return `exports.handler = function(event, context, callback) {
  // Replace below with your own code!
  console.log(event)
  console.log(context)

  callback(null, 'success!')
}`
}
