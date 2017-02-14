import Promise from 'bluebird'
import zipDir from './zip-dir'
import { putFunction } from '../modules/aws/lambda'
import { lambdaConfig, funcs, envVars } from './load'

export default function (pattern, env) {
  return Promise.resolve(funcs(pattern))
  .map((func) => {
    return Promise.join(
      lambdaConfig(func),
      zipDir(`dist/${func}`),
      envVars(env),
      putFunction
    )
  })
}
