import { readdirSync, readJSONSync } from './modules/fs'
import minimatch from 'minimatch'
import AWS from './aws'
import { listAliases, isFunctionDeployed } from './aws/lambda'
import Promise from 'bluebird'

export async function envs () {
  const pkg = this.pkg()
  if (!pkg || !pkg.shep) { return [] }

  const fns = await this.funcs()
  const fullFuncNames = fns.map(this.lambdaConfig).map(({ FunctionName }) => FunctionName)
  AWS.config.update({ region: pkg.shep.region })

  const deployedFunctions = await Promise.filter(fullFuncNames, isFunctionDeployed)
  const allAliases = await Promise.map(deployedFunctions, (name) => listAliases(name).map(({ Name }) => Name))

  return Promise.reduce(allAliases, async (acc, aliasSet) => {
    const missingAliases = aliasSet.filter((alias) => acc.indexOf(alias) === -1)
          .concat(acc.filter((alias) => aliasSet.indexOf(alias) === -1))

    if (missingAliases.length !== 0) {
      throw new Error('Mismatched aliases found, please run `shep config sync` to ensure all functions have the same environment')
    }

    return acc
  }, allAliases.pop())
}

export function events (func, eventName) {
  const eventDir = `functions/${func}/events`
  let events = readdirSync(`functions/${func}/events`)
  if (eventName) {
    events = events.filter((event) => event === `${eventName}.json`)
    if (events.length === 0) {
      throw new Error(`No event in '${eventDir}' called ${eventName}`)
    }
  }

  return events
}

export async function funcs (pattern = '*') {
  const funcs = readdirSync('functions').filter(minimatch.filter(pattern))
  if (funcs.length === 0) {
    throw new Error(`No functions found matching patterns: ${JSON.stringify(funcs)}`)
  } else {
    return funcs
  }
}

export function lambdaConfig (name) {
  const functionConfig = readJSONSync(`functions/${name}/lambda.json`)
  const projectConfig = readJSONSync(`lambda.json`)

  return Object.assign(projectConfig, functionConfig)
}

export function pkg () {
  return readJSONSync('package.json')
}

export function api () {
  try {
    return readJSONSync('api.json')
  } catch (e) {
    return null
  }
}

export function babelrc () {
  return readJSONSync('.babelrc')
}
