import AWS from './'
import Promise from 'bluebird'

export const DEPLOY_ATTEMPT_MAX = 2

export function exportStage (restApiId, stageName) {
  const apiGateway = new AWS.APIGateway()
  const params = {
    restApiId,
    stageName,
    exportType: 'swagger',
    accepts: 'json',
    parameters: {
      extensions: 'integrations,authorizers'
    }
  }

  return apiGateway.getExport(params).promise()
  .get('body')
}

export function deploy (id, env, attempts = 1) {
  const apiGateway = new AWS.APIGateway()
  return apiGateway.createDeployment({restApiId: id, stageName: env, variables: { functionAlias: env }}).promise()
  .catch({ code: 'TooManyRequestsException' }, ({ retryable, retryDelay }) => {
    if (!retryable && attempts > DEPLOY_ATTEMPT_MAX) throw new Error('Amazon limit hit')
    return Promise.delay(Math.ceil(retryDelay * 1000)).then(() => deploy(id, env, attempts++))
  })
}

export function pushApi (api, id) {
  const apiGateway = new AWS.APIGateway()

  let params = {
    body: JSON.stringify(api),
    failOnWarnings: true
  }

  if (id) {
    params.mode = 'overwrite'
    params.restApiId = id
    return apiGateway.putRestApi(params).promise().get('id')
  } else {
    return apiGateway.importRestApi(params).promise().get('id')
  }
}

export function aliases (id) {
  const apiGateway = new AWS.APIGateway()

  let params = {
    restApiId: id
  }

  return apiGateway.getStages(params).promise().get('item').map((x) => x.stageName)
}
