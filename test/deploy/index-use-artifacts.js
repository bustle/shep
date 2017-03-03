import test from 'ava'
import td from '../helpers/testdouble'

const functions = 'foo-*'
const env = 'beta'
const uploadedFuncs = [null, null]
const bucket = 's3_bucket'
const api = { paths: {} }
const apiId = 'test-id'

const build = td.replace('../../src/util/build-functions')
const apiGateway = td.replace('../../src/util/aws/api-gateway')
const setPermissions = td.replace('../../src/util/set-permissions')

const load = td.replace('../../src/util/load')
td.when(load.api()).thenReturn(api)

const push = td.replace('../../src/util/push-api')
td.when(push(api), { ignoreExtraArgs: true }).thenResolve(apiId)

const uploadBuilds = td.replace('../../src/util/upload-builds')
td.when(uploadBuilds(functions, bucket)).thenResolve(uploadedFuncs)

test.before(() => {
  const shep = require('../../src/index')
  return shep.deploy({ env, functions, bucket, quiet: true })
})

test('Builds functions', () => {
  td.verify(build(functions, env))
})

test('Deploys API', () => {
  td.verify(apiGateway.deploy(apiId, env))
})

test('Setup function permissions', () => {
  td.verify(setPermissions(api, apiId, env))
})
