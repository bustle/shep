import td from 'testdouble'

describe('build works', () => {
  beforeEach(() => {
    td.reset()
    const exec = td.replace('../../src/modules/exec')
    td.when(exec('webpack --bail'), { ignoreExtraArgs: true }).thenResolve({})
  })

  it('calls webpack', () => {
    const shep = require('../../src')
    return shep.build({ quiet: true })
  })
})
