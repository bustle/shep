const AWS = require('aws-sdk')
const Promise =  require('bluebird')

const methods = [
  'getFunction',
  'createFunction',
  'updateFunctionCode',
  'updateFunctionConfiguration',
  'createAlias',
  'getAlias',
  'updateAlias',
  'publishVersion',
  'addPermission'
]

methods.map((name)=>{
  module.exports[name] = function(params){
    return new Promise((resolve, reject)=>{
      const lambda = new AWS.Lambda()
      lambda[name](params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
})
