import Promise from 'bluebird'
import { putEnvironment } from './aws/lambda'
import { lambdaConfig, funcs } from './load'

const pattern = '*'

export default function (env, vars) {
  return Promise.resolve(funcs(pattern))
  .map((func) => {
    return Promise.join(
      env,
      lambdaConfig(func),
      vars,
      putEnvironment
    )
  })
}
