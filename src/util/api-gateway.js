import AWS from 'aws-sdk'
import Promise from 'bluebird'

const apiGateway = new AWS.APIGateway()

export function createRestApi(params){
  return new Promise((resolve, reject)=>{
    apiGateway.createRestApi(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
