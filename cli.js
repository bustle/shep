#! /usr/bin/env node
var resolve = require('resolve').sync

var shepGlobalPath = './lib/cli'
var shepGlobalVersion = require('./package.json').version
try {
  var shepLocalPath = resolve('shep/lib/cli', {basedir: process.cwd()})
  var shepLocalVersion = require(resolve('shep/package.json', {basedir: process.cwd()})).version
} catch (e) { }

if (process.argv.indexOf('--version') !== -1) {
  console.log('shep/cli', shepGlobalVersion)
  console.log('shep', shepLocalVersion || shepGlobalVersion)
  process.exit()
}

var cliPath = shepLocalPath || shepGlobalPath
var cli = require(cliPath)
if (typeof cli === 'function') {
  cli()
}
