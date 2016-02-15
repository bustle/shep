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

export function createDeployment(params){
  return new Promise((resolve, reject) => {
    apiGateway.createDeployment(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function getResources(id){
  return new Promise((resolve, reject)=>{
    const params = { restApiId: id, embed: 'methods'}
    apiGateway.getResources(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export function createResource(params){
  return new Promise((resolve, reject) => {
    apiGateway.createResource(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function putMethod(params){
  return new Promise((resolve, reject) => {
    apiGateway.putMethod(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function putMethodResponse(params){
  return new Promise((resolve, reject) => {
    apiGateway.putMethodResponse(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  }))
}

export function putIntegration(params){
  return new Promise((resolve, reject) => {
    apiGateway.putIntegration(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function putIntegrationResponse(params){
  return new Promise((resolve, reject) => {
    apiGateway.putIntegrationResponse(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
