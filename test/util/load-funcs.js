import test from 'ava'
import loadFuncs from '../../src/util/load-funcs'
import { create } from '../helpers/fixture'
import generateFunction from '../../src/generate/function'

test.before(() => {
  return create('load-funcs')
  .then(() => generateFunction({ name: 'foo' }) )
  .then(() => generateFunction({ name: 'bar' }) )

})

test('Loads all functions', (t) => {
  t.deepEqual(loadFuncs().sort(), ['bar', 'foo'])
})

test('Loads matching functions', (t) => {
  t.deepEqual(loadFuncs('*ar').sort(), ['bar'])
})

test('No functions exist', (t) => {
  t.throws(() => loadFuncs('no_match'), /No functions found/)
})
