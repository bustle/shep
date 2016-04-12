import test from 'ava'

const loadEnvs = require('../../src/util/load-envs')

test.before(()=> {
  process.chdir('../fixtures/test-api')
})

test('Loads the possible envs', (t) => {
  t.deepEqual(loadEnvs(), ['beta', 'production'])
})
