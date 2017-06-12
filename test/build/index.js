import test from 'ava'
import { exec } from '../helpers/exec'
import td from '../helpers/testdouble'

const load = td.replace('../../src/util/load')

test('Executed webpack', async (t) => {
  const shep = require('../../src')
  td.when(load.pkg()).thenResolve({})
  td.when(exec('webpack --bail'), { ignoreExtraArgs: true }).thenResolve()

  t.notThrows(shep.build({ quiet: true }))
})
