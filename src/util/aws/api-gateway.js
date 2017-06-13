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

export async function deploy (id, env, attempts = 1) {
  const apiGateway = new AWS.APIGateway()

  try {
    return apiGateway.createDeployment({restApiId: id, stageName: env, variables: { functionAlias: env }}).promise()
  } catch (e) {
    if (e.code !== 'TooManyRequestsException') { throw e }
    if (!e.retryable && attempts > DEPLOY_ATTEMPT_MAX) { throw new Error('Amazon limit hit') }
    await Promise.delay(e.retryDelay * 1000)
    return deploy(id, env, attempts++)
  }
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
