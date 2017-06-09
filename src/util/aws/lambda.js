import AWS from './'
import merge from 'lodash.merge'

export function getFunction (params) {
  const lambda = new AWS.Lambda()

  return lambda.getFunction(params).promise()
}

export async function isFunctionDeployed (FunctionName) {
  try {
    await getFunction({ FunctionName })
    return true
  } catch (e) {
    if (e.code !== 'ResourceNotFoundException') { throw new Error(e) }
    return false
  }
}

function throwResourceError (err) {
  const funcName = err.message.split(':').slice(-2, -1)[0]
  throw new Error(`No function found with name ${funcName}`)
}

export async function putFunction (env, config, ZipFile) {
  const lambda = new AWS.Lambda()

  validateConfig(config)

  const FunctionName = config.FunctionName
  const Publish = true

  try {
    await getFunction({ FunctionName })
  } catch (e) {
    if (e.code !== 'ResourceNotFoundException') { throw e }
    const params = merge(config, { Publish, Code: { ZipFile } })
    await lambda.createFunction(params).promise()
  }

  await putEnvironment(env, config)
  await lambda.updateFunctionCode({ ZipFile, FunctionName, Publish }).promise()

  /*
  return getFunction({ FunctionName })
  .then(() => putEnvironment(env, config))
  .then(() => lambda.updateFunctionCode({ ZipFile, FunctionName, Publish }).promise())
  .catch({ code: 'ResourceNotFoundException' }, () => {
    const params = merge(config, { Publish, Code: { ZipFile } })
    return lambda.createFunction(params).promise()
  })
  */
}

export async function putEnvironment (env, config, envVars) {
  const lambda = new AWS.Lambda()

  validateConfig(config)

  const params = {
    FunctionName: config.FunctionName,
    Qualifier: env
  }

  // if exists should update config, pub version, set alias to version
  let awsFunction
  try {
    awsFunction = await getFunction(params)
  } catch (e) {
    // if doesn't exist should grab existing config, update config,  pub version, set alias to version
    if (e.code !== 'ResourceNotFoundException') { throw e }
    awsFunction = await getFunction({ FunctionName: params.FunctionName })
  }

  const envMap = mergeExistingEnv(awsFunction, envVars)
  const lambdaConfig = merge(config, { Environment: { Variables: envMap } })
  const { FunctionName } = await lambda.updateFunctionConfiguration(lambdaConfig).promise()
  const func = await lambda.publishVersion({ FunctionName }).promise()
  return setAlias(func, env)
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
    if (err.code !== 'ResourceConflictException' && err.code !== 'ResourceNotFoundException') { throw err }
  })
}

export function listAliases (functionName) {
  const lambda = new AWS.Lambda()

  const params = {
    FunctionName: functionName
  }

  // should catch the issue of a func not existing
  return lambda.listAliases(params).promise().get('Aliases')
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
