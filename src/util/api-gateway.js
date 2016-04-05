import AWS from 'aws-sdk'
import Promise from 'bluebird'

export function createRestApi(params){
  return new Promise((resolve, reject)=>{
    const apiGateway = new AWS.APIGateway()
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
    const apiGateway = new AWS.APIGateway()
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
    const apiGateway = new AWS.APIGateway()
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
    const apiGateway = new AWS.APIGateway()
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
    const apiGateway = new AWS.APIGateway()
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
    const apiGateway = new AWS.APIGateway()
    apiGateway.putMethodResponse(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function putIntegration(params){
  return new Promise((resolve, reject) => {
    const apiGateway = new AWS.APIGateway()
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
    const apiGateway = new AWS.APIGateway()
    apiGateway.putIntegrationResponse(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
