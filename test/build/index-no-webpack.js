import { assert } from 'chai'
import td from 'testdouble'

let error = new Error()
error.code = 'ENOENT'

describe('build no webpack', () => {
  before(() => {
    td.reset()
    const exec = td.replace('../../src/util/modules/exec')
    td.when(exec('webpack --bail'), { ignoreExtraArgs: true }).thenThrow(error)
    td.replace(console, 'warn')
  })

  it('Logs to console when no webpack found', async () => {
    const shep = require('../../src')
    try {
      await shep.build({ quiet: true })
      assert.fail('Previous line should have thrown an error')
    } catch (e) {
      assert.strictEqual(e.code, 'ENOENT')
      td.verify(console.warn(), { ignoreExtraArgs: true })
    }
  })
})
