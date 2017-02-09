import td from 'testdouble'

const functions = 'foo-*'
const uploadedFuncs = ['foo', 'bar']
const env = 'beta'
const api = { paths: {} }
const apiId = 'test-id'

describe('build works', () => {
  let build, apiGateway, promoteAliases, setPermissions, load, push, upload

  beforeEach(() => {
    build = td.replace('../../src/util/build-functions')
    apiGateway = td.replace('../../src/util/aws/api-gateway')
    promoteAliases = td.replace('../../src/util/promote-aliases')
    setPermissions = td.replace('../../src/util/set-permissions')

    load = td.replace('../../src/util/load')
    td.when(load.api()).thenReturn(api)

    push = td.replace('../../src/util/push-api')
    td.when(push(api), { ignoreExtraArgs: true }).thenResolve(apiId)

    upload = td.replace('../../src/util/upload-functions')
    td.when(upload(functions, env)).thenResolve(uploadedFuncs)

    const shep = require('../../src/index')
    return shep.deploy({ env, functions, quiet: true })
  })

  it('Builds functions', () => {
    td.verify(build(functions, env))
  })

  it('Deploys API', () => {
    td.verify(apiGateway.deploy(apiId, env))
  })

  it('Promote function aliases', () => {
    td.verify(promoteAliases(uploadedFuncs, env))
  })

  it('Setup function permissions', () => {
    td.verify(setPermissions(api, apiId, env))
  })
})
