import Promise from 'bluebird'
import merge from 'lodash.merge'
import { updateFunction, getFunction } from './aws/lambda'
import { lambdaConfig, distPath } from './load'
import zipDir from './zip-dir'

export default async function (fns, env) {
  return Promise.map(fns, async ({ name, key, bucket }) => {
    const config = await lambdaConfig(name)
    const oldFunc = await getFunction({ FunctionName: config.FunctionName, Qualifier: env })
    const wantedFunc = merge({}, oldFunc)

    if (bucket && key) {
      wantedFunc.Code.s3 = { bucket, key }
    } else {
      const path = await distPath(name)
      console.log(path)
      wantedFunc.Code.Zip = await zipDir(path)
    }

    return updateFunction(oldFunc, wantedFunc)
  })
}
