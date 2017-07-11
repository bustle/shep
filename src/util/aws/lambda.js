import AWS from './'
import { Buffer } from 'buffer'
import loadRegion from './region-loader'
import merge from 'lodash.merge'
import { pkg } from '../load'

export async function getFunction (params) {
  await loadRegion()
  const lambda = new AWS.Lambda()

  return lambda.getFunction(params).promise()
}

export async function isFunctionDeployed (FunctionName, Qualifier) {
  await loadRegion()

  try {
    await getFunction({ FunctionName, Qualifier })
    return true
  } catch (e) {
    if (e.code !== 'ResourceNotFoundException') { throw e }
    return false
  }
}

export async function createFunction (env, config, { ZipFile, S3Object, S3Key }, envVars) {
  const lambda = new AWS.Lambda()
  const { FunctionName } = config

  if (await isFunctionDeployed(FunctionName, env)) {
    throw new Error('function is already deployed use updateFunction instead')
  }

  await lambda.createFunction(merge({}, config, { ZipFile, S3Key, S3Object, Environment: { Variables: envVars } })).promise()
  const func = await lambda.publishVersion({ FunctionName }).promise()
  return setAlias(func, env)
}

export async function updateFunction (env, config, { S3Bucket, S3Key }, envVars) {
  const lambda = new AWS.Lambda()
  const { name, shep } = await pkg()
  const { bucket } = shep
  const { FunctionName } = config

  if (!(await isFunctionDeployed(FunctionName, env))) {
    throw new Error('such a function does not exist')
  }

  const func = await getFunction({ FunctionName, Qualifier: env })

  // forgive me father for I have sinned
  const hexSha = Buffer.from(func.Configuration.CodeSha256, 'base64').toString('hex')
  const key = `${FunctionName.replace(name + '-', '')}-${hexSha}.zip`
  console.log(key)
  // end sinning

  const envMap = mergeExistingEnv(func, envVars)
  await lambda.updateFunctionConfiguration(merge({}, config, { Environment: { Variables: envMap } })).promise()
  const newFunc = await lambda.updateFunctionCode({ FunctionName, Publish: true, S3Key: S3Key || key, S3Bucket: S3Bucket || bucket }).promise()
  return setAlias(newFunc, env)
}

export async function removeEnvVars (env, config, envVars) {
  await loadRegion()
  const lambda = new AWS.Lambda()

  validateConfig(config)

  const params = {
    FunctionName: config.FunctionName,
    Qualifier: env
  }

  const awsFunction = await getFunction(params)
  const envMap = deleteEnvVars(awsFunction, envVars)
  const lambdaConfig = merge({}, config, { Environment: { Variables: envMap } })
  // need to switch to updateFunction
  /*
  const { FunctionName } = await lambda.updateFunctionConfiguration(lambdaConfig).promise()
  const func = await lambda.publishVersion({ FunctionName }).promise()
  return setAlias(func, env)
  */
}

export async function getEnvironment (env, { FunctionName }) {
  await loadRegion()
  const params = {
    FunctionName,
    Qualifier: env
  }

  try {
    const envVars = await getFunction(params)
    .get('Configuration')
    .get('Environment')
    .get('Variables')
    return envVars
  } catch (e) {
    if (e.code !== 'ResourceNotFoundException') { throw e }
    throw new AWSEnvironmentVariableNotFound(FunctionName)
  }
}

export async function getAliasVersion ({ functionName, aliasName }) {
  await loadRegion()
  const lambda = new AWS.Lambda()

  const params = {
    FunctionName: functionName,
    Name: aliasName
  }

  return lambda.getAlias(params).promise()
  .get('FunctionVersion')
}

export async function publishFunction ({ FunctionName }, env) {
  await loadRegion()
  const lambda = new AWS.Lambda()

  const func = await lambda.publishVersion({ FunctionName }).promise()
  return setAlias(func, env)
}

export async function setAlias ({ Version, FunctionName }, Name) {
  await loadRegion()
  const lambda = new AWS.Lambda()

  let params = {
    FunctionName,
    Name
  }

  try {
    await lambda.getAlias(params).promise()
    params.FunctionVersion = Version
    return lambda.updateAlias(params).promise()
  } catch (e) {
    if (e.code !== 'ResourceNotFoundException') { throw e }
    params.FunctionVersion = Version
    return lambda.createAlias(params).promise()
  }
}

export async function setPermission ({ name, region, env, apiId, accountId }) {
  await loadRegion()
  const lambda = new AWS.Lambda()

  let params = {
    Action: 'lambda:InvokeFunction',
    Qualifier: env,
    FunctionName: name,
    Principal: 'apigateway.amazonaws.com',
    StatementId: `api-gateway-${apiId}`,
    SourceArn: `arn:aws:execute-api:${region}:${accountId}:${apiId}/*`
  }

  try {
    const func = await lambda.addPermission(params).promise()
    return func
  } catch (e) {
    // Swallow errors if permission already exists
    if (e.code !== 'ResourceConflictException' && e.code !== 'ResourceNotFoundException') { throw e }
  }
}

export async function listAliases (functionName) {
  await loadRegion()
  const lambda = new AWS.Lambda()

  const params = {
    FunctionName: functionName
  }

  return lambda.listAliases(params).promise().get('Aliases')
}

function validateConfig (config) {
  if (!config.Role) {
    throw new AWSInvalidLambdaConfiguration()
  }
}

function mergeExistingEnv (awsFunction, envVars = {}) {
  if (awsFunction.Configuration.Environment) {
    return merge({}, awsFunction.Configuration.Environment.Variables, envVars)
  } else {
    return envVars
  }
}

function deleteEnvVars (awsFunction, envVars) {
  envVars.forEach((envVar) => {
    try {
      delete awsFunction.Configuration.Environment.Variables[envVar]
    } catch (e) {
      throw new AWSEnvironmentVariableNotFound(awsFunction.FunctionName, envVar)
    }
  })
  return awsFunction.Configuration.Environment.Variables
}

export class AWSEnvironmentVariableNotFound extends Error {
  constructor (functionName, envVar) {
    const msg = `Variable${envVar ? ' ' + envVar : 's'} not found for ${functionName}`
    super(msg)
    this.message = msg
    this.name = 'AWSEnvironmentVariableNotFound'
  }
}

export class AWSInvalidLambdaConfiguration extends Error {
  constructor () {
    const msg = 'You need to specify a valid Role for your lambda functions. See the shep README for details.'
    super(msg)
    this.message = msg
    this.name = 'AWSInvalidLambdaConfiguration'
  }
}
