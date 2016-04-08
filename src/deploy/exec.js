const Promise = require('bluebird')
const glob = require('../util/glob')
const deployFunction = require('../deploy-function')
const lambda = require('../util/lambda')
const apiGateway = require('../util/api-gateway')
const observatory = require('observatory')
const { assign } = require('lodash')

export default function(opts, api, pkg){
  const funcs = glob.sync('functions/*').map((path) => path.split('/').pop())
  const funcTask = observatory.add(`Deploying functions to AWS`)

  Promise.resolve(funcs)
  .map((name) => deployFunction(assign({ name }, opts), api, pkg) )
  .tap(()=>{ funcTask.done('All functions deployed!')})
  .map(publish)
  .map(setAlias)
  .map(setPermissions)
  .then(createApiDeployment)

  function publish(func){
    return lambda.publishVersion({ FunctionName: func.FunctionName })
  }

  function setAlias(func){
    let params = {
      FunctionName: func.FunctionName,
      Name: opts.env
    }

    return lambda.getAlias(params)
    .then(()=>{
      params.FunctionVersion = func.Version
      return lambda.updateAlias(params)
    })
    .catch((err)=>{
      if (err.code === 'ResourceNotFoundException'){
        params.FunctionVersion = func.Version
        return lambda.createAlias(params)
      } else {
        return Promise.reject(err)
      }
    })
  }

  function setPermissions(func){
    if (opts.api !== false) {
      const [, accountId, functionName] = func.AliasArn.match(new RegExp(`^arn:aws:lambda:${opts.region}:([0-9]+):function:([a-zA-Z0-9-_]+):`))

      let attrs = {
        Action: 'lambda:InvokeFunction',
        Qualifier: opts.env,
        FunctionName: functionName,
        Principal: 'apigateway.amazonaws.com',
        StatementId: 'api-gateway-access',
        SourceArn: `arn:aws:execute-api:${opts.region}:${accountId}:${opts.apiId}/*/*/*`
      }

      return lambda.addPermission(attrs)
      .catch((err) => { if (err.code !== 'ResourceConflictException'){ throw err } })
    }
  }

  function createApiDeployment(){
    if (opts.api !== false){
      return apiGateway.createDeployment({restApiId: opts.apiId, stageName: opts.env, variables: {functionAlias: opts.env}})
    }
  }
}
