import test from 'ava'
import loadEvents from '../../src/util/load-events'
import { create } from '../helpers/fixture'
import generateFunction from '../../src/generate/function'

test.before(() => {
  return create('load-funcs')
  .then(() => generateFunction({ name: 'foo' }) )
})

test('Loads the possible envs', (t) => {
  t.deepEqual(loadEvents('foo'), ['default.json'])
})

test('No events exist', (t) => {
  t.throws(() => loadEvents('foo', 'nothing'), /No events in/)
})
