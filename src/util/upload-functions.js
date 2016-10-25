import Promise from 'bluebird'
import zipDir from './zip-dir'
import { putFunction } from './aws/lambda'
import { lambdaConfig, funcs } from './load'

export default function (pattern) {
  return Promise.resolve(funcs(pattern))
  .map((func) => {
    return Promise.join(
      lambdaConfig(func),
      zipDir(`dist/${func}`),
      putFunction
    )
  })
}
