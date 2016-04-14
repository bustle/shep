module.exports = function({apiName, folder}){
  return `#${apiName || folder}`
}
