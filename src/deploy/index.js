import Promise from 'bluebird'
import glob from '../util/glob'
import upload from './upload'
import path from 'path'
import AWS from 'aws-sdk'

export default function(api, [envName, ], flags){

  // hack. use propmt
  if (!envName){ throw 'Specify an environment'}

  const funcs = glob.sync('functions/*/')
  const envConfig = require(path.join(process.cwd(),'env.js'))[envName]
  const apiGateway = new AWS.APIGateway()
  const lambda = new AWS.Lambda()

  return Promise.resolve(funcs)
  .tap(()=> { console.log("Packaging functions...") })
  .map((dir) => upload(dir, api.functionNamespace, envConfig) )
  .map(publish)
  .map(setAlias)
  .map(setPermissions)
  .tap(()=> { console.log("All functions deployed") })
  .then(()=>{
    console.log(flags)
    if (flags.api !== false) {
      return createDeployment({restApiId: api.id, stageName: envName, variables: {functionAlias: envName}})
      .tap(() => { console.log("API Gateway deployed") })
    }
  })

  function setAlias(func){
    let params = {
      FunctionName: func.FunctionName,
      Name: envName
    }

    return getAlias(params)
    .then(()=>{
      params.FunctionVersion = func.Version
      return updateAlias(params)
    })
    .catch((err)=>{
      if (err.code === 'ResourceNotFoundException'){
        params.FunctionVersion = func.Version
        return createAlias(params)
      } else {
        return Promise.reject(err)
      }
    })
  }

  function setPermissions(func){
    const [, accountId, functionName] = func.AliasArn.match(new RegExp(`^arn:aws:lambda:${api.region}:([0-9]+):function:([a-zA-Z0-9-_]+):`))

    let attrs = {
      Action: 'lambda:InvokeFunction',
      Qualifier: envName,
      FunctionName: functionName,
      Principal: 'apigateway.amazonaws.com',
      StatementId: 'api-gateway-access',
      SourceArn: `arn:aws:execute-api:${api.region}:${accountId}:${api.id}/*`
    }

    return addLambdaPermission(attrs)
    .catch((err) => { if (err.code !== 'ResourceConflictException'){ throw err } })
  }

  function publish(func){
    return publishVersion({ FunctionName: func.FunctionName })
  }

  function createDeployment(params){
    return (new Promise((resolve, reject) => {
      apiGateway.createDeployment(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }

  function publishVersion(params){
    return (new Promise((resolve, reject) => {
      lambda.publishVersion(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }

  function addLambdaPermission(params){
    return (new Promise((resolve, reject) => {
      lambda.addPermission(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }

  function getAlias(params){
    return (new Promise((resolve, reject) => {
      lambda.getAlias(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }

  function createAlias(params){
    return (new Promise((resolve, reject) => {
      lambda.createAlias(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }

  function updateAlias(params){
    return (new Promise((resolve, reject) => {
      lambda.updateAlias(params, (err, res)=>{
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }))
  }
}
