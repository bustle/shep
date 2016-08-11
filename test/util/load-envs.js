import test from 'ava'
import loadEnvs from '../../src/util/load-envs'
import { create } from '../helpers/fixture'

test.before(() => create('load-envs'))

test('Loads the possible envs', (t) => {
  t.deepEqual(loadEnvs().sort(), ['beta', 'development','production'])
})
