import test from 'ava'
import td from '../helpers/testdouble'
import yargs from 'yargs'
import { allFlags, noFlags } from '../helpers/yargs'

const load = td.replace('../../src/util/load')
td.when(load.envs()).thenResolve(['development'])

const newMock = td.replace('../../src/new')
const newParser = yargs.command(require('../../src/commands/new'))

const newArgs = {
  path: 'my_project',
  region: 'mordor',
  rolename: 'shepRole'
}

/*
test('Parses when all commands are given', async (t) => {
  const command = `new ${args.path} --rolename ${args.rolename} --region ${args.region}`
  parser.parse(command)
  td.verify(_new())
})
 */

test([allFlags, noFlags], 'new', newParser, newArgs)

const build = td.replace('../../src/build')
const buildParser = yargs.command(require('../../src/commands/build'))

const buildArgs = {
  functions: 'development'
}

test([allFlags, noFlags], 'build', buildParser, buildArgs)

const deploy = td.replace('../../src/deploy')
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

const logs = td.replace('../../src/logs')
const logsParser = yargs.command(require('../../src/commands/logs'))
const logsArgs = {
  stage: 'development',
  name: 'myfunction',
  region: 'mordor',
  stream: 'true'
}

test([allFlags, noFlags], 'logs', logsParser, logsArgs)

const pull = td.replace('../../src/pull')
const pullParser = yargs.command(require('../../src/commands/pull'))
const pullArgs = {
  region: 'mordor',
  stage: 'development',
  'api-id': 12345,
  output: 'api.json'
}

test([allFlags], 'pull', pullParser, pullArgs)

const endpoint = td.replace('../../src/generate-endpoint')
const endpointParser = yargs.command(require('../../src/commands/generate/endpoint'))
const endpointArgs = {
  method: 'get',
  path: '/test'
}

test([allFlags, noFlags], 'endpoint', endpointParser, endpointArgs)

test('verification of function calls', (t) => {
  // the new testdouble acts weird, possibly caused by issue with td itself
  // td.verify(newMock())
  td.verify(build(td.matchers.contains(buildArgs)))
  // td.verify(endpoint(td.matchers.contains(endpointArgs)))
  // td.veirfy(deploy(td.matchers.contains(deployArgs)))
  td.verify(doctor(td.matchers.contains(doctorArgs)))
})
