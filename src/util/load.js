import { readdir, readJSON } from './modules/fs'
import minimatch from 'minimatch'
import AWS from './aws'
import { listAliases, isFunctionDeployed } from './aws/lambda'
import Promise from 'bluebird'

export async function envs () {
  const pkg = await this.pkg()

  const fns = await this.funcs()
  const fullFuncNames = await Promise.map(fns, this.lambdaConfig).map(({ FunctionName }) => FunctionName)
  AWS.config.update({ region: pkg.shep.region })

  const deployedFunctions = await Promise.filter(fullFuncNames, isFunctionDeployed)
  const allAliases = await Promise.map(deployedFunctions, (name) => listAliases(name).map(({ Name }) => Name))

  return allAliases.reduce((acc, aliasSet) => {
    const missingAliases = aliasSet.filter((alias) => acc.indexOf(alias) === -1)
          .concat(acc.filter((alias) => aliasSet.indexOf(alias) === -1))

    if (missingAliases.length !== 0) {
      const err = new Error('Mismatched aliases found, please run `shep config sync` to ensure all functions have the same environment')
      err.name = 'EnvironmentMistmach'
      throw err
    }

    return acc
  }, allAliases.pop())
}

export async function events (func, eventName) {
  const eventDir = `functions/${func}/events`
  let events = await readdir(`functions/${func}/events`)
  if (eventName) {
    events = events.filter((event) => event === `${eventName}.json`)
    if (events.length === 0) {
      throw new Error(`No event in '${eventDir}' called ${eventName}`)
    }
  }

  return events
}

export async function funcs (pattern = '*') {
  const funcs = await readdir('functions').filter(minimatch.filter(pattern))
  if (funcs.length === 0) {
    throw new Error(`No functions found matching patterns: ${JSON.stringify(funcs)}`)
  } else {
    return funcs
  }
}

export async function lambdaConfig (name) {
  const functionConfig = await readJSON(`functions/${name}/lambda.json`)
  const projectConfig = await readJSON(`lambda.json`)

  return Object.assign(projectConfig, functionConfig)
}

export async function pkg () {
  const pkg = await readJSON('package.json')
  if (!pkg || !pkg.shep) { throw new Error('Missing shep section in package.json') }
  return pkg
}

export async function api () {
  try {
    const api = await readJSON('api.json')
    return api
  } catch (e) {
    return null
  }
}

export async function babelrc () {
  return readJSON('.babelrc')
}
