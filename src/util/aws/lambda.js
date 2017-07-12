import Promise from 'bluebird'
import AWS from './'
import { Buffer } from 'buffer'
import loadRegion from './region-loader'
import merge from 'lodash.merge'
import { pkg } from '../load'
import got from 'got'

const Function = {
  FunctionName: 'string',
  // should be ADT but hey this works
  Code: {
    CodeSha256: undefined || 'sha',
    Zip: undefined || 'binary string',
    s3: undefined || {
      bucket: 'string',
      key: 'string'
    }
  },
  Alias: 'string',
  Config: {}
}

export async function getFunction ({ FunctionName, Qualifier }) {
  await loadRegion()
  const lambda = new AWS.Lambda()

  const func = await lambda.getFunction({ FunctionName, Qualifier }).promise()
  return {
    FunctionName,
    Alias: Qualifier,
    Code: { CodeSha256: func.Configuration.CodeSha256 },
    Config: configStripper(func.Configuration)
  }
}

// TODO
export async function createFunction ({ }) {
}

// might want to check that the following are equal on these two objects:
// FunctionName, Alias, rest are mutable
export async function updateFunction (oldFunction, wantedFunction) {
  await loadRegion()
  const lambda = new AWS.Lambda()
  const { FunctionName, Alias } = oldFunction
  // if no zip or s3 then must grab
  const updateCodeParams = { FunctionName }
  const updateConfigParams = { FunctionName }
  const publishVersionParams = { FunctionName, Description: Alias }
  const updateAliasParams = { FunctionName }

  if (wantedFunction.Code.Zip) {
    updateCodeParams.ZipFile = wantedFunction.Code.Zip
  } else if (wantedFunction.Code.s3) {
    updateCodeParams.S3Bucket = wantedFunction.Code.s3.bucket
    updateCodeParams.S3Key = wantedFunction.Code.s3.key
  } else {
    const func = await lambda.getFunction({ FunctionName: oldFunction.FunctionName, Qualifier: oldFunction.Alias }).promise()

    publishVersionParams.CodeSha256 = func.Configuration.CodeSha256
    updateCodeParams.ZipFile = (await got(func.Code.Location, { encoding: null })).body
  }
  const uploadedFunc = await lambda.updateFunctionCode(updateCodeParams).promise()
  publishVersionParams.CodeSha256 = publishVersionParams.CodeSha256 || uploadedFunc.CodeSha256

  // should actually only contain config options we want changed
  merge(updateConfigParams, configStripper(oldFunction.Config), configStripper(wantedFunction.Config))
  await lambda.updateFunctionConfiguration((updateConfigParams)).promise()
  const { Version, CodeSha256 } = await lambda.publishVersion(publishVersionParams).promise()

  updateAliasParams.FunctionVersion = Version
  updateAliasParams.Name = Alias
  const config = await lambda.updateAlias(updateAliasParams).promise()

  return {
    FunctionName,
    Alias,
    Code: { CodeSha256 },
    Config: configStripper(config)
  }
}

function configStripper (config) {
  return {
    DeadLetterConfig: config.DeadLetterConfig,
    Description: config.Description,
    Environment: config.Environment,
    Handler: config.Handler,
    MemorySize: config.MemorySize,
    Role: config.Role,
    Runtime: config.Runtime,
    Timeout: config.Timeout,
    TracingConfig: config.TracingConfig
  }
}

/*
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

// hot fresh take actually create all aliases at the time
// means must give an array of aliases want created
export async function createFunction (env, config, { S3Object, S3Key }, envVars) {
  await loadRegion()
  validateConfig(config)

  const lambda = new AWS.Lambda()
  const { FunctionName } = config

  await lambda.createFunction(merge({}, config, { S3Key, S3Object, Environment: { Variables: envVars } })).promise()
  const func = await lambda.publishVersion({ FunctionName }).promise()
  return setAlias(func, env)
}

// new idea -> base (func name, qualifier), total config (lambdaConfig, env vars n such), code config (key bucket)
export async function updateFunction (3Bucket, S3Key }, envVars) {
  if (!(S3Bucket && S3Key )) { throw new Error('need bucket n key')}
  await loadRegion()
  validateConfig(config)

  const lambda = new AWS.Lambda()
  const { name, shep } = await pkg()
  const { FunctionName } = config

  const func = await getFunction({ FunctionName, Qualifier: env })

  // forgive me father for I have sinned
  const hexSha = Buffer.from(func.Configuration.CodeSha256, 'base64').toString('hex')
  const key = `${FunctionName.replace(name + '-', '')}-${hexSha}.zip`
  // end sinning

  const codeConfig = merge({ Publish: true, FunctionName, S3Bucket, S3Key })
  const envMap = mergeExistingEnv(func, envVars)
  await lambda.updateFunctionConfiguration(merge({}, config, { Environment: { Variables: envMap } })).promise()
  const newFunc = await lambda.updateFunctionCode(codeConfig).promise()
  return setAlias(newFunc, env)
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

*/
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
/*

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
*/
