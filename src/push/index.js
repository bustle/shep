import AWS from 'aws-sdk'
import Promise from 'bluebird'
import { readJsonSync, writeJsonSync } from 'fs-extra'

const apigateway = new AWS.APIGateway()

export default function(input, flags, config){
  return createApi()

  function createApi(){
    if (config.apiId){
      return Promise.reject(new Error('API already exists'))
    } else {
      return new Promise((resolve, reject)=>{
        const params = { name: config.apiName }
        apigateway.createRestApi(params, function(err, data) {
          if (err) {
            reject(err)
          } else {
            let configFile = readJsonSync('config.json')
            configFile.apiId = data.id
            writeJsonSync('config.json', configFile, { spaces: 2 })
            resolve(data)
          }
        })
      })
    }
  }
}
