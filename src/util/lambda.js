const AWS = require('aws-sdk')
const Promise =  require('bluebird')

const lambda = new AWS.Lambda()

module.exports.getFunc = function (params){
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

module.exports.createFunc = function(params){
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

module.exports.updateFuncCode = function(params){
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

module.exports.updateFuncConfig = function(params){
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

module.exports.createAlias = function(params){
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

module.exports.getAlias = function(params){
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

module.exports.updateAlias = function(params){
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

module.exports.publishVersion = function(params){
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


module.exports.addPermission = function(params){
  return (new Promise((resolve, reject) => {
    lambda.addPermission(params, (err, res)=>{
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  }))
}
