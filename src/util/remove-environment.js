import Promise from 'bluebird'
import { removeEnvVars } from './aws/lambda'
import { lambdaConfig, funcs } from './load'

const pattern = '*'

export default async function (env, vars) {
  const fns = await funcs(pattern)
  return Promise.map(fns, async (func) => removeEnvVars(env, await lambdaConfig(func), vars))
}
