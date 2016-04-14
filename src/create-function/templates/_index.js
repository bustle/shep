module.exports = function(){
  return `export function handler(event, context, callback) {
  // Replace below with your own code!
  console.log(event)
  console.log(context)

  callback(null, 'success!')
}`
}
