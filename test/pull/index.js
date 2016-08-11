import test from 'ava'
import { create } from '../helpers/fixture'
import td from 'testdouble'
import Promise from 'bluebird'
import fs from 'fs-extra-promise'

td.config({ promiseConstructor: Promise })

let apiGateway

const response = { body: '{ "foo": "bar" }' }
const apiId = 'test'
const region = 'east'
const stage = 'prod'

const apiGatewayOpts = { restApiId: apiId, stageName: stage }

test.before(() => {
  apiGateway = td.replace('../../src/util/api-gateway')
  td.when(apiGateway.getExport(td.matchers.contains(apiGatewayOpts))).thenResolve(response)

  return create('pull')
  .then(() => {
    const pull  = require('../../src/pull')
    return pull({ apiId, region, stage })
  })
})

test('Calls API Gateway', ()=>{
  td.verify(apiGateway.getExport(td.matchers.contains(apiGatewayOpts)), { times: 1 })
})

test('Writes api.json', t =>{
  t.deepEqual(fs.readJSONSync('api.json'), { foo: "bar" })
})

test('Updates package.json', t =>{
  t.deepEqual(fs.readJSONSync('package.json').shep, { apiId, region })
})
