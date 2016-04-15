import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

let lambda, exec

test.before(()=> {
  process.chdir('../fixtures/test-api')

  lambda = td.replace('../../src/util/lambda')

  td.when(lambda.getFunction(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))
  td.when(lambda.updateFunctionCode(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))
  td.when(lambda.updateFunctionConfiguration(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))

  const deployFunction = require('../../src/deploy-function/exec')

  return deployFunction({ name: 'pass', functionNamespace: 'test-api', silent: true, env: 'beta' }, [], { babel: { presets: [] }})
})

test('Uploads the existing function', ()=> {
  td.verify(lambda.getFunction(td.matchers.isA(Object)), { times: 1 })
  td.verify(lambda.updateFunctionCode(td.matchers.isA(Object)), { times: 1 })
  td.verify(lambda.updateFunctionConfiguration(td.matchers.isA(Object)), { times: 1 })
})
