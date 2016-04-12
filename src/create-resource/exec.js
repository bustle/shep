const Promise = require('bluebird')
const { createResource } = require('../util/api-gateway')
const pull = require('../pull/exec')

module.exports = function(opts, api){
  let lastSlashIndex = opts.path.lastIndexOf('/')
  let parentPath = opts.path.substring(0, lastSlashIndex)
  let pathPart = opts.path.substring(lastSlashIndex + 1)
  if (parentPath === '') { parentPath = '/'}
  let parentResource = api.find((resource) => resource.path === parentPath)

  if (parentResource){
    return createResource({ pathPart, restApiId: opts.apiId , parentId: parentResource.id })
    .then(()=> pull(opts))
  } else {
    return Promise.reject(`The parent resource '${parentPath}' does not exist. Create it first`)
  }
}
