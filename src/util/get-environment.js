import Promise from 'bluebird'
import { getEnvironment } from './aws/lambda'
import { lambdaConfig, funcs } from './load'

export default async function (env, name) {
  const fns = await funcs(name)
  return Promise.map(fns, async (func) => {
    const config = await lambdaConfig(func)
    return getEnvironment(env, config)
  })
}
