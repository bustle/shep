import td from 'testdouble'
import Promise from 'bluebird'

describe('build', () => {
  before(() => {
    const exec = td.replace('../../src/util/modules/exec')
    td.when(exec('webpack --bail'), { ignoreExtraArgs: true }).thenReturn(Promise.resolve())
  })

  after(() => {
    td.reset()
  })

  it('calls webpack', () => {
    const shep = require('../../src')
    return shep.build({ quiet: true })
  })
})
