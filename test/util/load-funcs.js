import test from 'ava'

const loadFuncs = require('../../src/util/load-funcs')

test.before(()=> {
  process.chdir('../fixtures/test-api')
})

test('Loads the possible functions', (t) => {
  t.deepEqual(loadFuncs(), ['fail', 'pass'])
})
