import Promise from 'bluebird'
import { environmentCheck, values } from '../util/environment-check'
import getFunctionEnvs from '../util/get-function-envs'
import uploadEnvironment from '../util/upload-environment'
import { funcs, lambdaConfig } from '../util/load'

export default async function ({ env }) {
  const configs = await Promise.map(funcs(), lambdaConfig)
  const environments = await getFunctionEnvs(env, configs)
  const { common, differences, conflicts } = environmentCheck(environments)

  if (Object.keys(conflicts).length !== 0) {
    const conflictVars = Object.keys(conflicts)
    const errMessage = `${conflictVars.join(', ')} have conflicting values. Fix this by using 'shep config set ${env}'`
    throw new Error(errMessage)
  }

  const combinedEnvironment = values(differences).reduce((acc, { key, value }) => {
    acc[key] = value.value
    return acc
  }, common)

  await uploadEnvironment(env, combinedEnvironment)
  return combinedEnvironment
}
