import test from 'ava'
import { exec } from '../helpers/exec'
import td from '../helpers/testdouble'

const buildCommand = 'custom-build --cool-flag -x 6'

const load = td.replace('../../src/util/load')
td.when(load.pkg()).thenResolve({ shep: { buildCommand } })

td.when(exec(), { ignoreExtraArgs: true }).thenResolve()

test('Executes custom command', (t) => {
  const shep = require('../../src')
  td.when(exec(buildCommand), { ignoreExtraArgs: true }).thenResolve()
  t.notThrows(shep.build({ quiet: true }))
})
