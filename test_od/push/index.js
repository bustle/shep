import test from 'ava'
import td from '../helpers/testdouble'
import { fs } from '../helpers/fs'

const apiId = 'foo'
const region = 'test'
const api = {
  swagger: '2.0',
  paths: {}
}

const apiGateway = td.replace('../../src/util/aws/api-gateway')
const pkgConfig = td.replace('../../src/util/pkg-config')

td.when(fs.readJSONSync('api.json')).thenReturn(api)
td.when(apiGateway.pushApi(td.matchers.isA(Object), undefined)).thenResolve(apiId)

test.before(() => {
  const shep = require('../../src')
  return shep.push({ region, quiet: true })
})

test('Updates package.json', () => {
  td.verify(pkgConfig.update({apiId, region}))
})
