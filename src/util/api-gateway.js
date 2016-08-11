import AWS from 'aws-sdk'
import Promise from 'bluebird'

const createDeployment = promisify('createDeployment')
const getExport = promisify('getExport')
const importRestApi = promisify('importRestApi')
const putRestApi = promisify('putRestApi')

function promisify(method){
  return function(params){
    return Promise.fromCallback((callback)=>{
      const apiGateway = new AWS.APIGateway()
      apiGateway[method](params, callback)
    })
  }
}

export { createDeployment, getExport, importRestApi, putRestApi }
