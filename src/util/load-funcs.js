const glob = require('glob')

module.exports = function(){
  return glob.sync('functions/*')
  .map((path) => path.split('/').pop())
}
