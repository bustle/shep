import Promise from 'bluebird'
import { updateFunction, getFunction, isFunctionDeployed, createFunction } from './aws/lambda'
import { lambdaConfig, distPath } from './load'
import zipDir from './zip-dir'

export default async function (fns, env) {
  return Promise.map(fns, async ({ name, key, bucket }) => {
    const config = await lambdaConfig(name)
    let wantedFunc = { Config: config, Code: {} }

    if (bucket && key) {
      wantedFunc.Code.s3 = { bucket, key }
    } else {
      const path = await distPath(name)
      wantedFunc.Code.Zip = await zipDir(path)
    }

    if (await isFunctionDeployed(config.FunctionName)) {
      const oldFunc = await getFunction({ FunctionName: config.FunctionName, Qualifier: env })
      return updateFunction(oldFunc, wantedFunc)
    } else {
      wantedFunc.FunctionName = config.FunctionName
      wantedFunc.Alias = env
      wantedFunc.Config = config
      return createFunction(wantedFunc)
    }
  })
}
