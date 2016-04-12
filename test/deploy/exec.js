import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

let apiGateway, pull

test.before(()=> {
  apiGateway = td.replace('../../src/util/api-gateway')
  pull = td.replace('../../src/pull/exec')

  td.when(apiGateway.createResource(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))

  const createResource = require('../../src/create-resource/exec')

  return createResource({ path: '/posts/{id}' }, [ {id: '1', path: '/'}, { id: '2', path: '/posts'} ])
})

test('Creates a resource', () => {
  td.verify(apiGateway.createResource(td.matchers.isA(Object)))
})
test('Pulls the latest api', () => {
  td.verify(pull(td.matchers.isA(Object)))
})
