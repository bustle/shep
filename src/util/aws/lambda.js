import AWS from './'
import merge from 'lodash.merge'

export function getFunction (params) {
  const lambda = new AWS.Lambda()

  return lambda.getFunction(params).promise()
}

function throwResourceError ({ message }) {
  const funcName = message.split(':').slice(-2, -1)[0]
  throw new Error(`No function found with name ${funcName}`)
}

export function putFunction (env, config, ZipFile) {
  const lambda = new AWS.Lambda()

  validateConfig(config)

  const FunctionName = config.FunctionName
  const Publish = true

  return getFunction({ FunctionName })
  .then(putEnvironment(env, config))
  .then(() => lambda.updateFunctionCode({ ZipFile, FunctionName, Publish }).promise())
  .catch({ code: 'ResourceNotFoundException' }, () => {
    const params = merge(config, { Publish, Code: { ZipFile } })
    return lambda.createFunction(params).promise()
  })
}

export function putEnvironment (env, config, envVars) {
  const lambda = new AWS.Lambda()

  validateConfig(config)

  const params = {
    FunctionName: config.FunctionName,
    Qualifier: env
  }

  return getFunction(params)
  .then((awsFunction) => {
    const envMap = mergeExistingEnv(awsFunction, envVars)
    const lambdaConfig = merge(config, { Environment: { Variables: envMap } })
    return lambda.updateFunctionConfiguration(lambdaConfig).promise()
  })
  .then(({ FunctionName }) => {
    return lambda.publishVersion({ FunctionName }).promise()
  })
  .then((func) => {
    setAlias(func, env)
  })
  .catch({ code: 'ResourceNotFoundException' }, throwResourceError)
  .catch((e) => {
    throw new Error(e)
  })
}

export function removeEnvVars (env, config, envVars) {
  const lambda = new AWS.Lambda()

  validateConfig(config)

  const params = {
    FunctionName: config.FunctionName,
    Qualifier: env
  }

  return getFunction(params)
  .then((awsFunction) => {
    const envMap = deleteEnvVars(awsFunction, envVars)
    const lambdaConfig = merge(config, { Environment: { Variables: envMap } })
    return lambda.updateFunctionConfiguration(lambdaConfig).promise()
  })
  .then(({ FunctionName }) => {
    return lambda.publishVersion({ FunctionName }).promise()
  })
  .then((func) => {
    setAlias(func, env)
  })
  .catch({ code: 'ResourceNotFoundException' }, throwResourceError)
  .catch((e) => {
    throw new Error(e)
  })
}

export function getEnvironment (env, { FunctionName }) {
  const params = {
    FunctionName,
    Qualifier: env
  }

  return getFunction(params)
  .get('Configuration')
  .get('Environment')
  .get('Variables')
  .catch({ code: 'ResourceNotFoundException' }, throwResourceError)
  .catch((e) => {
    throw new Error(`No environment variables exist for ${FunctionName}`)
  })
}

export function getAliasVersion ({ functionName, aliasName }) {
  const lambda = new AWS.Lambda()

  const params = {
    FunctionName: functionName,
    Name: aliasName
  }

  return lambda.getAlias(params).promise()
  .get('FunctionVersion')
}

export function publishFunction ({ FunctionName }, env) {
  const lambda = new AWS.Lambda()

  return lambda.publishVersion({ FunctionName }).promise()
  .then((func) => {
    setAlias(func, env)
  })
  .catch((e) => {
    throw new Error(e)
  })
}

export async function setAlias ({ Version, FunctionName }, Name) {
  const lambda = new AWS.Lambda()

  let params = {
    FunctionName,
    Name
  }

  return lambda.getAlias(params).promise()
  .then(() => {
    params.FunctionVersion = Version
    return lambda.updateAlias(params).promise()
  })
  .catch({ code: 'ResourceNotFoundException' }, () => {
    params.FunctionVersion = Version
    return lambda.createAlias(params).promise()
  })
}

export function setPermission ({ name, region, env, apiId, accountId }) {
  const lambda = new AWS.Lambda()

  let params = {
    Action: 'lambda:InvokeFunction',
    Qualifier: env,
    FunctionName: name,
    Principal: 'apigateway.amazonaws.com',
    StatementId: `api-gateway-${apiId}`,
    SourceArn: `arn:aws:execute-api:${region}:${accountId}:${apiId}/*`
  }

  return lambda.addPermission(params).promise()
  .catch((err) => {
    // Swallow errors if permission already exists
    if (err.code !== 'ResourceConflictException') { throw err }
  })
}

function validateConfig (config) {
  if (!config.Role) {
    throw new Error('You need to specify a valid Role for your lambda functions. See the shep README for details.')
  }
}

function mergeExistingEnv (awsFunction, envVars = {}) {
  if (awsFunction.Configuration.Environment) {
    return merge(awsFunction.Configuration.Environment.Variables, envVars)
  } else {
    return envVars
  }
}

function deleteEnvVars (awsFunction, envVars) {
  envVars.forEach((envVar) => {
    try {
      delete awsFunction.Configuration.Environment.Variables[envVar]
    } catch (e) {
      throw new Error(`Variable ${envVar} does not exist on AWS`)
    }
  })
  return awsFunction.Configuration.Environment.Variables
}
