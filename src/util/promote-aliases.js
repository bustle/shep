import { publishFunction } from './aws/lambda'
import Promise from 'bluebird'
import { lambdaConfig, funcs } from './load'

export default async function (pattern, env) {
  const fns = await funcs(pattern)
  return Promise.all(fns.map(async (func) => {
    return publishFunction(lambdaConfig(func), env)
  }))
}
