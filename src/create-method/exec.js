const genericTemplate = require('./templates/mapping')
const apiGateway = require('../util/api-gateway')
const { assign } = require('lodash')
const Promise = require('bluebird')
const pull = require('../pull/exec')

module.exports = function(opts, api){
  if (opts.resourceId && opts.resourcePath){
    return Promise.reject('You cannot specify both a `resourceId` and a `resourcePath`')
  }

  let resourceId = opts.resourceId
  if (opts.resourcePath){
    resourceId = api.find((resource) => resource.path === opts.resourcePath ).id
  }

  const remoteFuncName = opts.functionNamespace ? `${opts.functionNamespace}-${opts.funcName}` : opts.funcName
  const baseParams = {
    restApiId: opts.apiId,
    resourceId: resourceId,
    httpMethod: opts.httpMethod,
  }

  return apiGateway.putMethod(assign({ authorizationType: 'None'}, baseParams))
  .then(putIntegration)
  .then(putIntegrationResponse)
  .then(putMethodResponse)
  .then(()=> pull(opts))

  function putIntegration(){
    const attrs = {
      type: 'AWS',
      integrationHttpMethod: 'POST',
      uri: `arn:aws:apigateway:${opts.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:${opts.accountId}:function:${remoteFuncName}:\${stageVariables.functionAlias}/invocations`,
      requestTemplates: {}
    }

    attrs.requestTemplates[opts.contentType] = genericTemplate

    return apiGateway.putIntegration(assign(attrs, baseParams))
  }

  function putIntegrationResponse(){
    const attrs = {
      statusCode: opts.statusCode,
      responseTemplates: {}
    }

    attrs.responseTemplates[opts.contentType] = null

    return apiGateway.putIntegrationResponse(assign(attrs, baseParams))
  }

  function putMethodResponse(){
    const attrs = {
      statusCode: opts.statusCode
    }

    return apiGateway.putMethodResponse(assign(attrs, baseParams))
  }
}
