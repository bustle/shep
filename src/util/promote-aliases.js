import { publishFunction } from './aws/lambda'
import Promise from 'bluebird'
import { lambdaConfig, funcs } from './load'

export default async function (pattern, env) {
  const configs = await Promise.map(funcs(pattern), lambdaConfig)
  return Promise.map(configs, (config) => publishFunction(config, env))
}
