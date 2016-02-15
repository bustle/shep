import genericTemplate from './templates/mapping'
import { putIntegration, putIntegrationResponse, putMethod, putMethodResponse } from '../util/api-gateway'
import { assign } from 'lodash'

export default function(opts, config){

  const remoteFuncName = config.functionNamespace ? `${config.functionNamespace}-${opts.funcName}` : opts.funcName

  const baseParams = {
    restApiId: config.apiId,
    resourceId: opts.resourceId,
    httpMethod: opts.httpMethod,
  }

  return putMethod(assign({ authorizationType: 'None'}, baseParams))
  .then(() => {
    const attrs = {
      type: 'AWS',
      integrationHttpMethod: 'POST',
      uri: `arn:aws:apigateway:${config.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:${config.accountId}:function:${remoteFuncName}:\${stageVariables.functionAlias}/invocations`,
      requestTemplates: {}
    }

    attrs.requestTemplates[opts.contentType] = genericTemplate

    return putIntegration(assign(attrs, baseParams))
  })
  .then(() => {
    const attrs = {
      statusCode: opts.statusCode,
      responseTemplates: {}
    }

    attrs.responseTemplates[opts.contentType] = null

    return putIntegrationResponse(assign(attrs, baseParams))
  })
  .then(() => {
    const attrs = {
      statusCode: opts.statusCode
    }

    return putMethodResponse(assign(attrs, baseParams))
  })
}
