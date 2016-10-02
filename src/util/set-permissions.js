import { setPermission } from './aws/lambda'
import Promise from 'bluebird'

export default function (api, id, env){
  let promises = []
  for (var path in api.paths){
    for (var method in api.paths[path]){
      if (api.paths[path][method]['x-amazon-apigateway-integration'].type === 'aws_proxy') {
        const uri = api.paths[path][method]['x-amazon-apigateway-integration'].uri.split(':')
        promises.push(setPermission({
          env,
          region: uri[8],
          accountId: uri[9],
          apiId: id,
          name: uri[11]
        }))
      }
    }
  }
  return Promise.all(promises)
}
