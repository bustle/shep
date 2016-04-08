const Promise = require('bluebird')
const fs = require('../util/fs')
const AWS = require('aws-sdk')
const apiGateway = require('../util/api-gateway')
const templates = require('./templates')
const { assign } = require('lodash')

module.exports = function(opts = {}){

  return createProjectFolder()
  .then(createApi)
  .then(createFolders)
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

  function createFolders(){
    return Promise.all([
      fs.mkdirAsync(opts.folder + '/functions'),
      fs.mkdirAsync(opts.folder + '/config')
    ])
  }

  function createFiles(){
    return Promise.all([
      fs.writeFileAsync(opts.folder + '/package.json', templates.package(opts)),
      fs.writeFileAsync(opts.folder + '/config/development.env', templates.env(assign({env: 'development'},opts))),
      fs.writeFileAsync(opts.folder + '/config/beta.env', templates.env(assign({env: 'beta'},opts))),
      fs.writeFileAsync(opts.folder + '/config/production.env', templates.env(assign({env: 'production'},opts))),
      fs.writeFileAsync(opts.folder + '/.gitignore', templates.gitignore(opts)),
      fs.writeFileAsync(opts.folder + '/README.md', templates.readme(opts))
    ])
  }
}
