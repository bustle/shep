import Promise from 'bluebird'
import zipDir from './zip-dir'
import { putFunction } from './aws/lambda'
import { lambdaConfig } from './load'

export default async function (fns, env) {
  return Promise.all(fns.map(async (func) => {
    const zip = await zipDir(`dist/${func}`)
    return await putFunction(env, lambdaConfig(func), zip)
  }))
}
