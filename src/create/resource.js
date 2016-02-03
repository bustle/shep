import Promise from 'bluebird'
import prompt from '../util/prompt'
import pull from '../pull'
import AWS from 'aws-sdk'

export default function(config){
  const apiGateway = new AWS.APIGateway()

  return prompt([
    {
      name: 'path',
      message: 'Path?',
      default: '/users'
    }
  ])
  .then(create)
  .then(pull)

  function create(params){
    let lastSlashIndex = params.path.lastIndexOf('/')
    let parentPath = params.path.substring(0, lastSlashIndex)
    let pathPart = params.path.substring(lastSlashIndex + 1)
    if (parentPath === '') { parentPath = '/'}
    let parentResource = config.resources.find((resource) => resource.path === parentPath)

    if (parentResource){
      console.log('Creating Resource on AWS...')
      return createResource( config.id, parentResource.id, pathPart)
    } else {
      return Promise.reject(`The parent resource '${parentPath}' does not exist. Create it first`)
    }
  }

  function createResource(restApiId, parentId, pathPart){
    return (new Promise((resolve, reject) => {
        apiGateway.createResource({ restApiId, parentId, pathPart }, (err, res)=>{
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    )
  }
}
