import Promise from 'bluebird'
import { getEnvironment } from './aws/lambda'
import { lambdaConfig, funcs } from './load'

export default function (env, name) {
  return Promise.resolve(funcs(name))
  .map((func) => {
    return Promise.join(
      env,
      lambdaConfig(func),
      getEnvironment
    )
  })
}
