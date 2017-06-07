import Promise from 'bluebird'
import merge from 'lodash.merge'
import * as load from '../util/load'
import { environmentCheck, values } from '../util/environment-check'
import AWS from '../util/aws'
import { isFunctionDeployed, listAliases, getEnvironment, putEnvironment } from '../util/aws/lambda'

export default async function (specifiedAlias) {
  const pkg = load.pkg()
  AWS.config.update({ region: pkg.shep.region })

  const funcNames = await load.funcs()
  .map(load.lambdaConfig)
  .map(({ FunctionName }) => FunctionName)

  const deployedFuncs = await Promise.filter(funcNames, (f) => isFunctionDeployed(f))
  const allFuncAliases = await Promise.map(deployedFuncs, listAliases)

  // don't let me merge this without killing this statement
  const aliases = specifiedAlias === undefined
        ? allFuncAliases.reduce((aliaseSet, funcAliases) => {
          funcAliases.forEach(({ Name }) => aliaseSet.add(Name))
          return aliaseSet
        }, new Set())
        : new Set().add(specifiedAlias)

  // suppose we have arr of all envs that need to be created
  return Promise.each(aliases, async (alias) => {
    const environments = await Promise.reduce(deployedFuncs, async (acc, fullName) => {
      // could throw something?
      try {
        const env = await getEnvironment(alias, { FunctionName: fullName })
        acc[fullName] = env
      } catch (e) {
        acc[fullName] = {}
      }
      return acc
    }, {})

    // run env check on for each alias
    const { common, differences, conflicts } = environmentCheck(environments)
    if (Object.keys(conflicts).length !== 0) {
      // throw some error, w/ conflict vars and request user to run `shep config set alias CONFLICT=val`
      // conflicts is obj of envVars keys and objects of conflicts as values
      const conflictVars = Object.keys(conflicts)
      const errMessage = `${conflictVars.join(', ')} have conflicting values. Fix this by using 'shep config set ${alias}'`
      throw new Error(errMessage)
    }
    // if no conflicts create a merged environment for each alias
    // study combine all diffs with common
    const combinedDiffs = values(differences).reduce((acc, { key, value }) => {
      acc[key] = value.value
      return acc
    }, {})
    const combinedEnvironment = merge(common, combinedDiffs)
    // for each deployed function want to putEnvironment for each alias, this will create the alias as well
    return Promise.map(deployedFuncs, (FunctionName) => putEnvironment(alias, { FunctionName }, combinedEnvironment))
    // fin
  })
}
