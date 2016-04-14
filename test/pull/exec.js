import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

let fs, apiGateway

test.before(()=> {
  fs = td.replace('../../src/util/fs')
  apiGateway = td.replace('../../src/util/api-gateway')

  td.when(fs.writeJsonAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(apiGateway.getResources(td.matchers.isA(Object)), { ignoreExtraArgs: true }).thenReturn(Promise.resolve({}))

  const pull  = require('../../src/pull/exec')

  return pull({ apiId: 'test' })
})

test('Gets exported API from AWS', () => {
  td.verify(apiGateway.getResources(), { times: 1, ignoreExtraArgs: true })
})

test('Creates an api.json file', () => {
  td.verify(fs.writeJsonAsync(td.matchers.contains('api.json')), { times: 1, ignoreExtraArgs: true })
})
