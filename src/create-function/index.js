import Promise from 'bluebird'
import fs from 'fs-extra-promise'
import deploy from '../deploy-function'

export default function(opts, config){
  createDir()
  .then(createFiles)
  .then(createOnAWS)

  function createDir(){
    return fs.mkdirAsync(`functions/${opts.name}`)
  }

  function createFiles(){
    return Promise.all([
      fs.writeFileAsync(`functions/${opts.name}/index.js`, require('./templates/index').default(opts)),
      fs.writeFileAsync(`functions/${opts.name}/package.json`, require('./templates/package').default(opts)),
      fs.writeFileAsync(`functions/${opts.name}/.gitignore`, require('./templates/gitignore').default(opts)),
      fs.writeFileAsync(`functions/${opts.name}/lambda.json`, require('./templates/lambda').default(opts)),
      fs.writeFileAsync(`functions/${opts.name}/event.json`, require('./templates/event').default(opts)),
      fs.writeFileAsync(`functions/${opts.name}/env.js`, require('./templates/env').default(opts))
    ])
  }

  function createOnAWS(){
    return deploy({ name: opts.name, namespace: config.functionNamespace })
  }
}
