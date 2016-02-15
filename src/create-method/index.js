import genericTemplate from '../templates/api-gateway'
import { putIntegration, putIntegrationResponse, putMethod, putMethodResponse } from '../util/api-gateway'

export default function(opts, config){

  const baseParams = {
    restApiId: config.apiId,
    resourceId: opts.resourceId,
    httpMethod: opts.httpMethod,
  }

  return putMethod(assign({ authorizationType: 'None'}, baseParams))
  .then((params) => {
    const attrs = {
      restApiId: config.apiId,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      type: 'AWS',
      integrationHttpMethod: 'POST',
      uri: `arn:aws:apigateway:${config.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:${config.accountId}:function:${config.functionNamespace + opts.funcName}:\${stageVariables.functionAlias}/invocations`,
      requestTemplates: {}
    }

    attrs.requestTemplates[params.contentType] = genericTemplate

    return putIntegration(attrs)
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
  })
  .then((params) => {
    const attrs = {
      restApiId: api.id,
      resourceId: params.resourceId,
      httpMethod: params.httpMethod,
      statusCode: params.statusCode
    }

    return putMethodResponse(attrs)
  })
}
