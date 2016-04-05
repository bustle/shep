const Promise = require('bluebird')
const fs = require('../util/fs')
const AWS = require('aws-sdk')
const apiGateway = require('../util/api-gateway')
const templates = require('./templates')

module.exports = function(opts = {}){

  return createProjectFolder()
  .then(createApi)
  .then(createFiles)

  function createProjectFolder(){
    return fs.mkdirAsync(opts.folder)
  }

  function createApi(){
    if (opts.api !== false){
      AWS.config.update({region: opts.region })
      return apiGateway.createRestApi({ name: opts.apiName })
      .then(({ id }) => { opts.apiId = id })
    }
  }

  function createFiles(){
    return Promise.all([
      fs.mkdirAsync(opts.folder + '/functions'),
      fs.writeFileAsync(opts.folder + '/package.json', templates.package(opts)),
      fs.writeFileAsync(opts.folder + '/env.js', templates.env(opts)),
      fs.writeFileAsync(opts.folder + '/env.js.example', templates.env(opts)),
      fs.writeFileAsync(opts.folder + '/.gitignore', templates.gitignore(opts)),
      fs.writeFileAsync(opts.folder + '/README.md', templates.readme(opts))
    ])
  }
}
