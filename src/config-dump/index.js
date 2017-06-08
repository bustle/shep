import * as load from '../util/load'
import Promise from 'bluebird'
import { getEnvironment } from '../util/aws/lambda'
import { environmentCheck, values } from '../util/environment-check'

export default async function (opts) {
  const fns = await load.funcs()
  const envs = await Promise.reduce(fns, async (acc, funcName) => {
    const fullName = load.lambdaConfig(funcName).FunctionName
    try {
      const env = await getEnvironment(opts.env, { FunctionName: fullName })
      acc[funcName] = env
    } catch (e) {
      acc[funcName] = {}
    }
    return acc
  }, {})

  const { common, differences, conflicts } = environmentCheck(envs)

  if (opts.json) {
    console.log(JSON.stringify(common, undefined, 2))
  } else {
    console.log('Common Variables:')
    console.log(values(common).map(({ key, value }) => `${key}=${value}`).join('\n'))
    if (Object.keys(differences).length !== 0) {
      console.error('Variables that are present on some functions:')
      console.error(values(differences).map(({ key, value }) => `${key}=${value.value} on the following functions: ${value.functions.join(', ')}`).join('\n'))
    }
    if (Object.keys(conflicts).length !== 0) {
      console.error('Variables that have conflicting values across different functions')
      console.log(values(conflicts).map(({ key, value }) => {
        const funcValues = values(value).map((obj) => `\t${key}=${obj.value} on ${obj.key}`)
        return `Variable: ${key}\n${funcValues.join('\n')}`
      }).join('\n'))
    }
  }
}
