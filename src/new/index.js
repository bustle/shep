import Promise from 'bluebird'
import fs from 'fs-extra-promise'
import AWS from 'aws-sdk'

export default function(opts){

  return createProjectFolder()
  .then(createApi)
  .then(createFiles)

  function createProjectFolder(){
    return fs.mkdirAsync(opts.folder)
  }

  function createApi(){
    if (opts.api !== false){
      AWS.config.update({region: opts.region })
      return require('../util/api-gateway').createRestApi({ name: opts.apiName })
      .then(({ id }) => { opts.apiId = id })
    }
  }

  function createFiles(){
    return Promise.all([
      fs.mkdirAsync(opts.folder + '/functions'),
      fs.writeFileAsync(opts.folder + '/package.json', require('./templates/package').default(opts)),
      fs.writeFileAsync(opts.folder + '/env.js', require('./templates/env').default(opts)),
      fs.writeFileAsync(opts.folder + '/env.js.example', require('./templates/env').default(opts)),
      fs.writeFileAsync(opts.folder + '/.gitignore', require('./templates/gitignore').default(opts)),
      fs.writeFileAsync(opts.folder + '/README.md', require('./templates/readme').default(opts))
    ])
  }
}
