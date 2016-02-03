import AWS from 'aws-sdk'
import Promise from 'bluebird'

const lambda = new AWS.Lambda()

export function getFunc(params){
  return new Promise((resolve, reject)=>{
    lambda.getFunction(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function createFunc(params){
  return new Promise((resolve, reject)=>{
    lambda.createFunction(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function updateFuncCode(params){
  return new Promise((resolve, reject)=>{
    lambda.updateFunctionCode(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function updateFuncConfig(params){
  return new Promise((resolve, reject)=>{
    lambda.updateFunctionConfiguration(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function createAlias(params){
  return new Promise((resolve, reject)=>{
    lambda.createAlias(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function getAlias(params){
  return new Promise((resolve, reject)=>{
    lambda.getAlias(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function updateAlias(params){
  return new Promise((resolve, reject)=>{
    lambda.updateAlias(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function publishVersion(params){
  return new Promise((resolve, reject)=>{
    lambda.publishVersion(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
