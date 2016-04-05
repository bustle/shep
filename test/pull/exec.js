import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

let fs, apiGateway

test.before(()=> {
  fs = td.replace('../../src/util/fs')
  apiGateway = td.replace('../../src/util/api-gateway')

  td.when(fs.writeJsonAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(apiGateway.getResources(td.matchers.anything())).thenReturn(Promise.resolve({items: []}))

  const pull  = require('../../src/pull/exec')

  return pull()
})

test('Gets API json from AWS', () => {
  td.verify(apiGateway.getResources(), { times: 1, ignoreExtraArgs: true })
})

test('Creates an api.json file', () => {
  td.verify(fs.writeJsonAsync(), { times: 1, ignoreExtraArgs: true })
})
