import Promise from 'bluebird'
import { funcs, lambdaConfig } from '../../util/load'

export default async function () {
  const funcNames = await funcs('*')
  const configs = await Promise.map(funcNames, lambdaConfig)
  const warnConfigs = configs.filter(missingDescription)
  return warnConfigs.map(generateWarning)
}

function missingDescription (config) {
  return !config.Description
}

function generateWarning (config) {
  return {
    rule: 'missing-description',
    message: `Function ${config.FunctionName} has no description set`
  }
}
