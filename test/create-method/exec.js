import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

let apiGateway, pull

test.before(()=> {
  apiGateway = td.replace('../../src/util/api-gateway')
  pull = td.replace('../../src/pull/exec')

  td.when(apiGateway.putMethod(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))
  td.when(apiGateway.putIntegration(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))
  td.when(apiGateway.putMethodResponse(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))
  td.when(apiGateway.putIntegrationResponse(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))

  const createMethod = require('../../src/create-method/exec')

  return createMethod({})
})

test('Creates a method', () => {
  td.verify(apiGateway.putMethod(td.matchers.isA(Object)))
})
test('Creates a integration', () => {
  td.verify(apiGateway.putIntegration(td.matchers.isA(Object)))
})
test('Creates a method response', () => {
  td.verify(apiGateway.putMethodResponse(td.matchers.isA(Object)))
})
test('Creates a integration response', () => {
  td.verify(apiGateway.putIntegrationResponse(td.matchers.isA(Object)))
})
test('Pulls the latest api', () => {
  td.verify(pull(td.matchers.isA(Object)))
})
