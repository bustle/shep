import { join } from 'path'
import { pathPrefix } from '../'
import { readdir, readJSON } from './modules/fs'
import minimatch from 'minimatch'
import { listAliases, isFunctionDeployed } from './aws/lambda'
import Promise from 'bluebird'

export async function envs () {
  const fullFuncNames = await Promise.map(this.funcs(), this.lambdaConfig)
  .map(({ FunctionName }) => FunctionName)

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
  const eventDir = join(pathPrefix, `functions/${func}/events`)
  let events = await readdir(eventDir)
  if (eventName) {
    events = events.filter((event) => event === `${eventName}.json`)
    if (events.length === 0) {
      throw new Error(`No event in '${eventDir}' called ${eventName}`)
    }
  }

  return events
}

export async function funcs (pattern = '*') {
  const funcs = await readdir(join(pathPrefix, 'functions')).filter(minimatch.filter(pattern))
  if (funcs.length === 0) {
    throw new Error(`No functions found matching patterns: ${JSON.stringify(funcs)}`)
  } else {
    return funcs
  }
}

export async function lambdaConfig (name) {
  const functionConfig = await readJSON(join(pathPrefix, `functions/${name}/lambda.json`))
  const projectConfig = await readJSON(join(pathPrefix, `lambda.json`))

  return Object.assign(projectConfig, functionConfig)
}

export async function pkg () {
  const pkg = await readJSON(join(pathPrefix, 'package.json'))
  if (!pkg || !pkg.shep) { throw new Error('Missing shep section in package.json') }
  return pkg
}

export async function api () {
  try {
    const api = await readJSON(join(pathPrefix, 'api.json'))
    return api
  } catch (e) {
    return null
  }
}

export function babelrc () {
  return readJSON(join(pathPrefix, '.babelrc'))
}
