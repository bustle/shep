import test from 'ava'
import td from '../helpers/testdouble'

const response = '{ "foo": "bar" }'
const apiId = 'test'
const stage = 'prod'
const region = 'east'

const apiGateway = td.replace('../../src/util/aws/api-gateway')
const fs = td.replace('../../src/modules/fs')
const pkgConfig = td.replace('../../src/util/pkg-config')

td.when(apiGateway.exportStage(apiId, stage)).thenResolve(response)

test.before(() => {
  const shep = require('../../src')
  return shep.pull({ apiId, region, stage, quiet: true })
})

test('Writes api.json', () => {
  td.verify(fs.writeFile('api.json', response, td.matchers.isA(Object)))
})

test('Updates package.json', () => {
  td.verify(pkgConfig.update({apiId, region}))
})
