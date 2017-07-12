import Promise from 'bluebird'
import merge from 'lodash.merge'
import { getFunction, updateFunction } from './aws/lambda'
import { lambdaConfig, funcs } from './load'

const pattern = '*'

// clean up
export default async function (env, vars) {
  const configs = await Promise.map(funcs(pattern), async (name) => { return { name, config: await lambdaConfig(name) } })
  return Promise.map(configs, async ({name, config}) => {
    const oldFunc = await getFunction({ FunctionName: config.FunctionName, Qualifier: env })

    const wantedFunc = merge({}, oldFunc)
    wantedFunc.Config.Environment.Variables = merge({}, wantedFunc.Config.Environment.Variables, vars)

    return updateFunction(oldFunc, wantedFunc)
  }, { concurrency: 1 })
}
