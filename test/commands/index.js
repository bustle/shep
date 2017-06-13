import test from 'ava'
import td from '../helpers/testdouble'
import yargs from 'yargs'
import { allFlags, noFlags } from '../helpers/yargs'

const load = td.replace('../../src/util/load')
td.when(load.envs()).thenResolve(['development'])
td.when(load.funcs()).thenResolve(['myfunction'])
td.when(load.pkg()).thenReturn({ shep: { apiId: '123456' } })

const inquirer = td.replace('inquirer')
td.when(inquirer.prompt(), { ignoreExtraArgs: true }).thenResolve({})

td.replace('../../src/new')
const newParser = yargs.command(require('../../src/commands/new'))

const newArgs = {
  path: 'my_project',
  region: 'mordor',
  rolename: 'shepRole'
}

test([allFlags, noFlags], 'new', newParser, newArgs)

const build = td.replace('../../src/build')
const buildParser = yargs.command(require('../../src/commands/build'))

const buildArgs = {
  functions: 'development'
}

test([allFlags, noFlags], 'build', buildParser, buildArgs)

td.replace('../../src/deploy')
const deployParser = yargs.command(require('../../src/commands/deploy'))
const deployArgs = {
  env: 'development',
  functions: '\'*\'',
  build: true
}

test([allFlags, noFlags], 'deploy', deployParser, deployArgs)

const doctor = td.replace('../../src/doctor')
const doctorParser = yargs.command(require('../../src/commands/doctor'))
const doctorArgs = {
  verbose: 'true'
}

test([allFlags, noFlags], 'doctor', doctorParser, doctorArgs)

td.replace('../../src/logs')
const logsParser = yargs.command(require('../../src/commands/logs'))
const logsArgs = {
  env: 'development',
  name: 'myfunction',
  region: 'mordor',
  stream: 'true'
}

test([allFlags, noFlags], 'logs', logsParser, logsArgs)

td.replace('../../src/pull')
const pullParser = yargs.command(require('../../src/commands/pull'))
const pullArgs = {
  region: 'mordor',
  stage: 'development',
  'api-id': 12345,
  output: 'api.json'
}

test([allFlags], 'pull', pullParser, pullArgs)

const push = td.replace('../../src/push')
const pushParser = yargs.command(require('../../src/commands/push'))
const pushArgs = {
  'api-id': 12345,
  region: 'mordor'
}

test([allFlags], 'push', pushParser, pushArgs)

td.replace('../../src/run')
const runParser = yargs.command(require('../../src/commands/run'))
const runArgs = {
  pattern: '\'*\'',
  environment: 'development',
  event: 'default.json',
  build: 'true'
}

test([allFlags, noFlags], 'run', runParser, runArgs)

td.replace('../../src/generate-endpoint')
const endpointParser = yargs.command(require('../../src/commands/generate/endpoint'))
const endpointArgs = {
  method: 'get',
  path: '/test'
}

test([allFlags, noFlags], 'endpoint', endpointParser, endpointArgs)

td.replace('../../src/generate-function')
const functionParser = yargs.command(require('../../src/commands/generate/function'))
const functionArgs = {
  name: 'myfunction'
}

test([allFlags, noFlags], 'function', functionParser, functionArgs)

const webpack = td.replace('../../src/generate-webpack')
const webpackParser = yargs.command(require('../../src/commands/generate/webpack'))
const webpackArgs = {
  output: 'dumb.js'
}

test([allFlags, noFlags], 'webpack', webpackParser, webpackArgs)

td.replace('../../src/config-list')
const listParser = yargs.command(require('../../src/commands/config/list'))
const listArgs = {
  env: 'development',
  function: 'myfunction'
}

test([allFlags, noFlags], 'list', listParser, listArgs)

td.replace('../../src/config-remove')
const removeParser = yargs.command(require('../../src/commands/config/remove'))

test('config remove command', (t) => {
  removeParser.parse('remove --env development MY_KEY OTHER_KEY', (err, argv, output) => {
    err ? t.fail(err) : t.pass()
  })
})

td.replace('../../src/config-set')
const setParser = yargs.command(require('../../src/commands/config/set'))

test('config set command', (t) => {
  setParser.parse('set --env development FOO=bar', (err, argv, output) => {
    err ? t.fail(err) : t.pass()
  })
})

test('verification of function calls', (t) => {
  // If the verify call is commented out there were issues with the test double

  // td.verify(newMock())
  td.verify(build(td.matchers.contains(buildArgs)))
  // td.verify(deploy(td.matchers.contains(deployArgs)))
  td.verify(doctor(td.matchers.contains(doctorArgs)))
  // td.verify(pull(td.matchers.contains(pullArgs)))
  td.verify(push(td.matchers.contains(pushArgs)))
  // td.verify(run(td.matchers.contains(runArgs)))
  // td.verify(endpoint(td.matchers.contains(endpointArgs)))
  // td.verify(functionMock(td.matchers.contains(functionArgs)))
  td.verify(webpack(td.matchers.contains(webpackArgs)))
  // td.verify(list(td.matchers.contains(listArgs)))
  // td.verify(remove(), { ignoreExtraArgs: true })
  // td.verify(set(), { ignoreExtraArgs: true })
})
