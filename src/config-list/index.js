import * as load from '../util/load'
import Promise from 'bluebird'
import { isFunctionDeployed } from '../util/aws/lambda'
import getFunctionEnvs from '../util/get-function-envs'
import { environmentCheck } from '../util/environment-check'

export default async function ({ env, quiet = true, json }) {
  const fnConfigs = await Promise.filter(load.funcs().map(load.lambdaConfig), ({ FunctionName }) => isFunctionDeployed(FunctionName))
  const envs = await getFunctionEnvs(env, fnConfigs)
  const { common, differences, conflicts } = environmentCheck(envs)

  if (json && Object.keys(conflicts).concat(Object.keys(differences)).length !== 0) {
    throw new Error('Environments are out of sync, run `shep config sync` to fix')
  }
  return { common, differences, conflicts }
}
