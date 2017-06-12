import Promise from 'bluebird'
import { putEnvironment } from './aws/lambda'
import { lambdaConfig, funcs } from './load'

const pattern = '*'

export default async function (env, vars) {
  const configs = await Promise.map(funcs(pattern), lambdaConfig)
  return Promise.map(configs, (config) => putEnvironment(env, config, vars), { concurrency: 3 })
}
