import prompt from '../util/prompt'
import glob from 'glob'
import Promise from 'bluebird'
import AWS from 'aws-sdk'
import genericTemplate from '../templates/api-gateway'

export default function(api){
  const funcNames = glob.sync('functions/*/').map((dir) => dir.split('/').slice(-2, -1)[0] )
  const resourcePaths = api.resources.map((resource) => resource.path).sort()
  const apiGateway = new AWS.APIGateway()

  return prompt([
    {
      name: 'resource',
      type: 'list',
      choices: resourcePaths,
      message: 'Which resource?'
    },
    {
      name: 'httpMethod',
      type: 'list',
      choices: ['GET', 'POST', 'PUT', 'DELETE'],
      message: 'Which HTTP Method?'
    },
    {
      name: 'statusCode',
      default: '200',
      message: 'Default Status Code'
    },
    {
      name: 'contentType',
      default: 'application/json',
      message: 'Default content type'
    },
    {
      name: 'funcName',
      type: 'list',
      choices: funcNames,
      message: 'Which lambda function?'
    }
  ])
  .then((params)=>{
    params.resourceId = api.resources.find((resource) => resource.path === params.resource).id
    return params
  })
  .then((params) => {

    const attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      authorizationType: 'None'
    }

    return putMethod(attrs)
    .return(params)
  })
  .then((params) => {
    const attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      type: 'AWS',
      integrationHttpMethod: 'POST',
      uri: `arn:aws:apigateway:${api.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:${api.accountId}:function:${api.functionNamespace + params.funcName}:\${stageVariables.functionAlias}/invocations`,
      requestTemplates: {}
    }

    attrs.requestTemplates[params.contentType] = genericTemplate

    return putIntegration(attrs)
    .return(params)
  })
  .then((params) => {
    const attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      statusCode: params.statusCode,
      responseTemplates: {}
    }

    attrs.responseTemplates[params.contentType] = null

    return putIntegrationResponse(attrs)
    .return(params)
  })
  .then((params) => {
    const attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      statusCode: params.statusCode
    }

    return putMethodResponse(attrs)
    .return(params)
  })

  function putMethod(params){
    return (new Promise((resolve, reject) => {
      apiGateway.putMethod(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }

  function putMethodResponse(params){
    return (new Promise((resolve, reject) => {
      apiGateway.putMethodResponse(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }

  function putIntegration(params){
    return (new Promise((resolve, reject) => {
      apiGateway.putIntegration(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }

  function putIntegrationResponse(params){
    return (new Promise((resolve, reject) => {
      apiGateway.putIntegrationResponse(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }
}
