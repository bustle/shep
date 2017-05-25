import { readdir, readdirSync, readJSONSync } from './modules/fs'
import minimatch from 'minimatch'
import AWS from './aws'
import { aliases } from './aws/api-gateway'

export async function envs () {
  const pkg = this.pkg()

  if (pkg && pkg.shep && pkg.shep.apiId) {
    AWS.config.update({ region: pkg.shep.region })
    return aliases(pkg.shep.apiId)
  } else {
    return []
  }
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
  const funcs = await readdir('functions').filter(minimatch.filter(pattern))
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
