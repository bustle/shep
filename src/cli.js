#! /usr/bin/env node
const minimist = require('minimist')
const resolve = require('resolve')
const { mapKeys, camelCase } = require('lodash')

const args = minimist(process.argv.slice(2))
const command = args._
delete args._
const flags = mapKeys(args, (v, k) => camelCase(k) )

let shepPath

try {
  shepPath = resolve.sync('shep', { basedir: process.cwd() })
  if (flags.debug){ console.log('Local version found!')}
} catch (e) {
  shepPath = './index'
  if (flags.debug){ console.log('Local version not found. Using global.')}
}

const shep = require(shepPath)

if (shep[camelCase(command)]){
  shep[camelCase(command)](flags).catch((err) => { throw(err) })
} else {
  console.log(`${command} is not a valid command`)
  process.exit(1)
}
