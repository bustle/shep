import Promise from 'bluebird'
import glob from '../util/glob'
import deployFunction from '../deploy-function'
import { getAlias, createAlias, updateAlias, addPermission, publishVersion } from '../util/lambda'
import { createDeployment } from '../util/api-gateway'
import observatory from 'observatory'

export default function({ namespace, env, envName }, config){
  const funcs = glob.sync('functions/*').map((path) => path.split('/').pop())
  const funcTask = observatory.add(`Deploying functions to AWS`)

  Promise.resolve(funcs)
  .map((name) => deployFunction({ name, namespace, env, babelConfig: config.babelConfig }) )
  .tap(()=>{ funcTask.done('All functions deployed!')})
  .map(publish)
  .map(setAlias)
  .map(setPermissions)
  .then(createApiDeployment)

  function publish(func){
    return publishVersion({ FunctionName: func.FunctionName })
  }

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
    if (config.api !== false) {
      const [, accountId, functionName] = func.AliasArn.match(new RegExp(`^arn:aws:lambda:${config.region}:([0-9]+):function:([a-zA-Z0-9-_]+):`))

      let attrs = {
        Action: 'lambda:InvokeFunction',
        Qualifier: envName,
        FunctionName: functionName,
        Principal: 'apigateway.amazonaws.com',
        StatementId: 'api-gateway-access',
        SourceArn: `arn:aws:execute-api:${config.region}:${accountId}:${config.apiId}/*/*/*`
      }

      return addPermission(attrs)
      .catch((err) => { if (err.code !== 'ResourceConflictException'){ throw err } })
    }
  }

  function createApiDeployment(){
    if (config.api !== false){
      return createDeployment({restApiId: config.apiId, stageName: envName, variables: {functionAlias: envName}})
    }
  }
}
