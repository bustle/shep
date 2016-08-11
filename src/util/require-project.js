const path = require('path')

module.exports = function(projectPath){
  return require(path.join(process.cwd(), projectPath))
}
