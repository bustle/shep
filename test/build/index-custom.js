import td from 'testdouble'

const buildCommand = 'custom-build --cool-flag -x 6'

describe('custom build command', () => {
  beforeEach(() => {
    const exec = td.replace('../../src/modules/exec')
    const load = td.replace('../../src/util/load')
    td.when(load.pkg()).thenReturn({ shep: { buildCommand } })
    td.when(exec(buildCommand), { ignoreExtraArgs: true }).thenResolve()
  })

  it('calls command', () => {
    const shep = require('../../src')
    return shep.build({ quiet: true })
  })
})
