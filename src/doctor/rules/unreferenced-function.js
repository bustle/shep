import * as load from '../../util/load'
import parseApi from '../../util/parse-api'
import Promise from 'bluebird'

export default async function () {
  const api = await load.api()
  if (!api) { return [] }

  const funcNames = await load.funcs()
  const funcConfigs = await Promise.map(funcNames, load.lambdaConfig)
  const parsedApi = parseApi(api)
  const unreferencedFunctions = funcConfigs.filter(({ FunctionName }) => {
    return !parsedApi.some(({ integration }) => isFuncInUri(FunctionName, integration.uri))
  })

  return unreferencedFunctions.map(generateWarning)
}

function isFuncInUri (funcName, uri) {
  if (uri === undefined) { return false }
  const funcRegExp = new RegExp(`:${funcName}:`)
  return funcRegExp.test(uri)
}

function generateWarning ({ FunctionName }) {
  return {
    rule: 'unreferenced-functions',
    message: `Function ${FunctionName} isn't referenced by api.json`
  }
}
