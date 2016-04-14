const AWS = require('aws-sdk')
const Promise = require('bluebird')

const methods = [
  'createRestApi',
  'createDeployment',
  'createResource',
  'putMethod',
  'putMethodResponse',
  'putIntegration',
  'putIntegrationResponse'
]

methods.map((name)=>{
  module.exports[name] = function(params){
    return new Promise((resolve, reject)=>{
      const apiGateway = new AWS.APIGateway()
      apiGateway[name](params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
})


// We have to hack this method because of this bug: https://github.com/aws/aws-sdk-js/issues/764
module.exports.getResources = function(params){
  return new Promise((resolve, reject)=>{
    const apiGateway = new AWS.APIGateway()
    const req = apiGateway.getResources(params)
    req.on('build', function(req) {
        req.httpRequest.path += '/?embed=methods';
    })
    req.send(function(err, data) {
        if (err) {
            reject(err)
        } else {
            resolve(data)
        }
    })
  })
}
