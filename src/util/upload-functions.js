import Promise from 'bluebird'
import zipDir from './zip-dir'
import { putFunction } from './aws/lambda'
import { lambdaConfig } from './load'

export default async function (fns, env) {
  return Promise.map(fns, async (func) => {
    const zip = await zipDir(`dist/${func}`)
    return putFunction(env, lambdaConfig(func), zip)
  })
}
