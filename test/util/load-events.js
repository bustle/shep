import test from 'ava'
import loadEvents from '../../src/util/load-events'
import { create } from '../helpers/fixture'
import generateFunction from '../../src/generate/function'
import fs from 'fs-extra-promise'

test.before(() => {
  return create('load-events')
  .then(() => generateFunction({ name: 'foo' }) )
  .then(() => fs.writeJsonAsync('functions/foo/events/success.json', {}))
})

test('Loads all events', (t) => {
  t.deepEqual(loadEvents('foo').sort(), ['default.json', 'success.json'])
})

test('Loads a single event', (t) => {
  t.deepEqual(loadEvents('foo', 'success'), ['success.json'])
})

test('No events exist', (t) => {
  t.throws(() => loadEvents('foo', 'no-match'), /No event in/)
})
