import AWS from 'aws-sdk'
import Promise from 'bluebird'
import fs from 'fs-extra-promise'
import { assign } from 'lodash'

const apigateway = new AWS.APIGateway()

export default function(){
  return fs.readJsonAsync('api.json')
  .then((api)=>{
    if (api.id){
      return getResources(api.id).get('items').then((resources) => [api, resources])
    } else {
      return Promise.reject(new Error('No `id` found in api.json file'))
    }
  })
  .then(([api, resources])=>{
    return fs.writeJsonAsync('api.json', assign(api, { resources }) , { spaces: 2 })
  })

  function getResources(id){
    return new Promise((resolve, reject)=>{
      const params = { restApiId: id, embed: 'methods'}
      apigateway.getResources(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}
