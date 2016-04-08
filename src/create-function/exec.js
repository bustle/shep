const Promise = require('bluebird')
const fs = require('../util/fs')
const deploy = require('../deploy-function/exec')
const templates = require('./templates')

module.exports = function(opts){

  return createDir()
  .then(createFiles)
  .return(opts)
  .then(deploy)

  function createDir(){
    return fs.mkdirAsync(`functions/${opts.name}`)
  }

  function createFiles(){
    return Promise.all([
      fs.writeFileAsync(`functions/${opts.name}/index.js`, templates.index(opts)),
      fs.writeFileAsync(`functions/${opts.name}/package.json`, templates.package(opts)),
      fs.writeFileAsync(`functions/${opts.name}/lambda.json`, templates.lambda(opts)),
      fs.writeFileAsync(`functions/${opts.name}/event.json`, templates.event(opts))
    ])
  }
}
