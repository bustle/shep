const glob = require('glob')

module.exports = function(){
  return glob.sync('config/*')
  .map((path) => path.split('/').pop())
  .map((file) => file.split('.').shift())
}
