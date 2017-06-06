import * as load from '../util/load'
import { getEnvironment } from '../util/aws/lambda'

export default async function (opts) {
  const fns = await load.funcs()
  const envs = await fns.reduce(async (acc, funcName) => {
    const fullName = load.lambdaConfig(funcName).FunctionName
    const env = await getEnvironment(opts.env, { FunctionName: fullName })
    acc[funcName] = env
    return acc
  }, {})

  // create all 3 at once, check if every env has the key w/ same value -> common
  // if one has diff value -> conflict
  // if one is missing key -> push all func names w/ matching key/value to diff
  const [common, diff, conflicts] = Object.keys(envs).reduce(([commonAcc, diffAcc, conflictAcc], func) => {
    const env = envs[func]
    Object.keys(env).forEach((envVar) => {
      if (commonAcc[envVar] || diffAcc[envVar] || conflictAcc[envVar]) { return }

      const hasMatchingKeyValue = matchingKeyValue(envVar, env[envVar])
      const keyIsUndefinedOrSame = undefinedOrSame(envVar, env[envVar])

      if (values(envs).every(hasMatchingKeyValue)) {
        commonAcc[envVar] = env[envVar]
      } else if (!values(envs).every(keyIsUndefinedOrSame)) {
        conflictAcc[envVar] = values(envs).filter((obj) => !keyIsUndefinedOrSame(obj)).reduce((acc, { key, value }) => {
          acc[key] = value
          return acc
        }, {})
      } else {
        // pretty sure that this is the only option would like to verify
        const funcsWithVarPresent = values(envs).filter(hasMatchingKeyValue).map(({ key, value }) => key)
        diffAcc[envVar] = { value: env[envVar], functions: funcsWithVarPresent }
      }
    })
    return [commonAcc, diffAcc, conflictAcc]
  }, [{}, {}, {}])

  if (opts.json) {
    console.log(JSON.stringify(common, undefined, 2))
  } else {
    console.log('Common Variables:')
    console.log(values(common).map(({ key, value }) => `${key}=${value}`).join('\n'))
    if (Object.keys(diff).length !== 0) {
      console.error('Variables that are present on some functions:')
      console.error(values(diff).map(({ key, value }) => `${key}=${value.value} on the following functions: ${value.functions.join(', ')}`))
    }
    if (Object.keys(conflicts).length !== 0) {
      console.error('Variables that have conflicting values across different functions')
      values(conflicts).map(({ key, value }) => {
        const funcValues = values(value).map((obj) => `${key}=${obj.value} on ${obj.key}`)
        return `Variable: ${key}\n${funcValues.join('\t\n')}`
      })
    }
  }
}

function matchingKeyValue (masterKey, masterValue) {
  return ({ key, value }) => {
    return value[masterKey] === masterValue
  }
}

function undefinedOrSame (masterKey, masterValue) {
  return ({ key, value }) => {
    return value[masterKey] === undefined || value[masterKey] === masterValue
  }
}

function values (obj) {
  return Object.keys(obj).map((key) => {
    return { key, value: obj[key] }
  })
}
