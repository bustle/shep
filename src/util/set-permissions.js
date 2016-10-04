import { setPermission } from './aws/lambda'
import Promise from 'bluebird'

export default function (api, id, env) {
  let promises = []
  Object.keys(api.paths).map((path) => {
    Object.keys(api.paths[path]).map((method) => {
      const uri = api.paths[path][method]['x-amazon-apigateway-integration'].uri
      if (uri && uri.includes('aws:lambda')) {
        const uriParts = uri.split(':')
        promises.push(setPermission({
          env,
          region: uriParts[8],
          accountId: uriParts[9],
          apiId: id,
          name: uriParts[11]
        }))
      }
    })
  })

  return Promise.all(promises)
}
