import AWS from './'
import loadRegion from './region-loader'
import merge from 'lodash.merge'
import got from 'got'
import { AWSEnvironmentVariableNotFound } from '../errors'

/*
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
  Identifier: {
   Alias: undefined || 'string',
   Version: undefined || 'string'
  }
  Config: {}
}
*/

export async function getFunction ({ FunctionName, Qualifier }) {
  await loadRegion()
  const lambda = new AWS.Lambda()

  const func = await lambda.getFunction({ FunctionName, Qualifier }).promise()
  const isVersion = /[0-9]+/.test(Qualifier)
  return {
    FunctionName,
    Identifier: {
      Version: func.Configuration.Version,
      Alias: isVersion ? undefined : Qualifier
    },
    Code: { CodeSha256: func.Configuration.CodeSha256 },
    Config: configStripper(func.Configuration)
  }
}

export async function createFunction ({ FunctionName, Alias, Code, Config }) {
  validateConfig(Config)
  await loadRegion()
  const lambda = new AWS.Lambda()

  const createFunctionParams = { FunctionName, Publish: true, Code: {}, Config }
  const createAliasParams = { FunctionName, Name: Alias }

  if (Code.s3) {
    createFunctionParams.Code.S3Bucket = Code.s3.bucket
    createFunctionParams.Code.S3Key = Code.s3.key
  } else if (Code.Zip) {
    createFunctionParams.Code.ZipFile = Code.Zip
  } else {
    throw new Error('need to upload code')
  }

  const newFunc = await lambda.createFunction(createFunctionParams).promise()

  createAliasParams.FunctionVersion = newFunc.Version
  await lambda.createAlias(createAliasParams).promise()

  return {
    FunctionName,
    Identifier: {
      Alias,
      Version: newFunc.Version
    },
    Config: configStripper(newFunc),
    Code: { CodeSha256: newFunc.CodeSha256 }
  }
}

// might want to check that the following are equal on these two objects:
// FunctionName, Alias, rest are mutable
export async function updateFunction (oldFunction, wantedFunction) {
  validateConfig(wantedFunction.Config)
  await loadRegion()
  const lambda = new AWS.Lambda()
  const { FunctionName, Alias } = oldFunction
  const updateCodeParams = { FunctionName }
  const updateConfigParams = { FunctionName }
  const publishVersionParams = { FunctionName, Description: `Based off of ${Alias}` }
  const updateAliasParams = { FunctionName }

  if (wantedFunction.Code.Zip) {
    updateCodeParams.ZipFile = wantedFunction.Code.Zip
  } else if (wantedFunction.Code.s3) {
    updateCodeParams.S3Bucket = wantedFunction.Code.s3.bucket
    updateCodeParams.S3Key = wantedFunction.Code.s3.key
  } else {
    const { Code, Configuration } = await lambda.getFunction({ FunctionName: oldFunction.FunctionName, Qualifier: oldFunction.Alias }).promise()

    publishVersionParams.CodeSha256 = Configuration.CodeSha256
    updateCodeParams.ZipFile = (await got(Code.Location, { encoding: null })).body
  }
  const uploadedFunc = await lambda.updateFunctionCode(updateCodeParams).promise()
  publishVersionParams.CodeSha256 = publishVersionParams.CodeSha256 || uploadedFunc.CodeSha256

  merge(updateConfigParams, configStripper(wantedFunction.Config))
  await lambda.updateFunctionConfiguration((updateConfigParams)).promise()
  const { Version, CodeSha256 } = await lambda.publishVersion(publishVersionParams).promise()

  updateAliasParams.FunctionVersion = Version
  updateAliasParams.Name = Alias
  const config = await lambda.updateAlias(updateAliasParams).promise()

  return {
    FunctionName,
    Identifier: {
      Alias,
      Version
    },
    Code: { CodeSha256 },
    Config: configStripper(config)
  }
}

// should beef this up
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

export async function getEnvironment (env, { FunctionName }) {
  await loadRegion()
  const params = {
    FunctionName,
    Qualifier: env
  }

  try {
    const envVars = await getFunction(params)
    .get('Config')
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

export class AWSInvalidLambdaConfiguration extends Error {
  constructor () {
    const msg = 'You need to specify a valid Role for your lambda functions. See the shep README for details.'
    super(msg)
    this.message = msg
    this.name = 'AWSInvalidLambdaConfiguration'
  }
}
