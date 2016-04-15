import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

let lambda

test.before(()=> {
  process.chdir('../fixtures/test-api')

  lambda = td.replace('../../src/util/lambda')

  td.when(lambda.getFunction(td.matchers.isA(Object))).thenReturn(Promise.reject({ code: 'ResourceNotFoundException'}))
  td.when(lambda.createFunction(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))

  const deployFunction = require('../../src/deploy-function/exec')

  return deployFunction({ name: 'fail', functionNamespace: 'test-api', silent: true, env: 'beta' }, [], { babel: { presets: [] }})
})

test('Creates a new function', ()=> {
  td.verify(lambda.getFunction(td.matchers.isA(Object)), { times: 1 })
  td.verify(lambda.createFunction(td.matchers.isA(Object)), { times: 1 })
})
