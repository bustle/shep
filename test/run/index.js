import test from 'ava'
import { create } from '../helpers/fixture'
import generateFunction from '../../src/generate/function'
import td from 'testdouble'
import Promise from 'bluebird'
import run from '../../src/run'

// Supress observetory output
require('observatory').settings({ write: () => {} })

td.config({ promiseConstructor: Promise })

test.before(() => {
  return create('run')
  .then(() => generateFunction({ name: 'foo' }) )
})

test('Calls the function', (t)=>{
  t.truthy(run({ name: 'foo' }))
})
