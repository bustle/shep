import test from 'ava'
import run from '../../src/run'

test.before(() => {
  return create('run')
  .then(() => generateFunction({ name: 'foo' }) )
  .then(() => generateFunction({ name: 'bar' }) )
})

test('Calls the function', (t)=>{
  t.truthy(run({ name: 'foo', build: true }))
})

test('Throws an exception for an event that does not exist', (t)=>{
  t.throws(() => run({ name: 'foo', build: true, event: 'doesnotexist' }))
})

test('Throws an exception for unbuilt function', (t)=>{
  t.throws(run({ name: 'bar', build: false }))
})
