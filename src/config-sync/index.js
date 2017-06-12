import Promise from 'bluebird'
import * as load from '../util/load'
import { environmentCheck, values } from '../util/environment-check'
import AWS from '../util/aws'
import { isFunctionDeployed, listAliases } from '../util/aws/lambda'
import getFunctionEnvs from '../util/get-function-envs'
import uploadEnvironment from '../util/upload-environment'

export default async function (specifiedAlias) {
  const pkg = await load.pkg()
  AWS.config.update({ region: pkg.shep.region })

  const funcConfigs = await Promise.map(load.funcs(), load.lambdaConfig)
  const deployedFuncs = await Promise.filter(funcConfigs, ({ FunctionName }) => isFunctionDeployed(FunctionName))
  const allFuncAliases = await Promise.map(deployedFuncs, ({ FunctionName }) => listAliases(FunctionName))

  const aliases = new Set()
  if (specifiedAlias === undefined) {
    allFuncAliases.reduce((aliaseSet, funcAliases) => {
      funcAliases.forEach(({ Name }) => aliaseSet.add(Name))
      return aliaseSet
    }, aliases)
  } else {
    aliases.add(specifiedAlias)
  }

  return Promise.each(aliases, async (alias) => {
    const environments = await getFunctionEnvs(alias, deployedFuncs)
    const { common, differences, conflicts } = environmentCheck(environments)

    if (Object.keys(conflicts).length !== 0) {
      const conflictVars = Object.keys(conflicts)
      const errMessage = `${conflictVars.join(', ')} have conflicting values. Fix this by using 'shep config set ${alias}'`
      throw new Error(errMessage)
    }

    const combinedEnvironment = values(differences).reduce((acc, { key, value }) => {
      acc[key] = value.value
      return acc
    }, common)

    await uploadEnvironment(alias, combinedEnvironment)
    console.log(`Successfully synced ${alias} environment across all functions`)
  })
}
