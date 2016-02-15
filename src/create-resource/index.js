import Promise from 'bluebird'
import { createResource } from '../util/api-gateway'
import pull from '../pull'

export default function(opts, config){
  let lastSlashIndex = opts.path.lastIndexOf('/')
  let parentPath = opts.path.substring(0, lastSlashIndex)
  let pathPart = opts.path.substring(lastSlashIndex + 1)
  if (parentPath === '') { parentPath = '/'}
  let parentResource = config.resources.find((resource) => resource.path === parentPath)

  if (parentResource){
    return createResource({ pathPart, restApiId: config.apiId , parentId: parentResource.id })
    .then(() => pull(config))
  } else {
    return Promise.reject(`The parent resource '${parentPath}' does not exist. Create it first`)
  }
}
