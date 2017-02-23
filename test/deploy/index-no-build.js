import test from 'ava'
import td from '../helpers/testdouble'

const functions = 'foo-*'
const uploadedFuncs = ['foo', 'bar']
const env = 'beta'
const api = { paths: {} }
const apiId = 'test-id'

const build = td.replace('../../src/util/build-functions')
const apiGateway = td.replace('../../src/util/aws/api-gateway')
const promoteAliases = td.replace('../../src/util/promote-aliases')
const setPermissions = td.replace('../../src/util/set-permissions')

const load = td.replace('../../src/util/load')
td.when(load.api()).thenReturn(api)

const push = td.replace('../../src/util/push-api')
td.when(push(api), { ignoreExtraArgs: true }).thenResolve(apiId)

const upload = td.replace('../../src/util/upload-functions')
td.when(upload(functions, env)).thenResolve(uploadedFuncs)

test.before(() => {
  const shep = require('../../src/index')
  return shep.deploy({ build: false, env, functions, quiet: true })
})

test('Builds functions', () => {
  td.verify(build(), { times: 0, ignoreExtraArgs: true })
})

test('Deploys API', () => {
  td.verify(apiGateway.deploy(apiId, env))
})

test('Promote function aliases', () => {
  td.verify(promoteAliases(uploadedFuncs, env))
})

test('Setup function permissions', () => {
  td.verify(setPermissions(api, apiId, env))
})
