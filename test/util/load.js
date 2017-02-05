import { assert } from 'chai'
import * as load from '../../src/util/load'

describe('util/load', () => {
  const origWd = process.cwd()
  before(() => process.chdir('./test/fixtures'))
  after(() => process.chdir(origWd))

  it('Loads environments', () => {
    assert.deepEqual(load.envs().sort(), [ 'beta', 'prod' ])
  })

  it('Loads functions', () => {
    assert.deepEqual(load.funcs().sort(), [ 'bar', 'foo' ])
  })

  it('Loads functions by pattern', () => {
    assert.deepEqual(load.funcs('f*'), [ 'foo' ])
  })

  it('Loads function events', () => {
    assert.deepEqual(load.events('foo').sort(), [ 'custom.json', 'default.json' ])
  })

  it('Loads lambda config', () => {
    const config = load.lambdaConfig('foo')
    assert.strictEqual(config.Name, 'foo')
    assert.strictEqual(config.Role, 'admin')
    assert.strictEqual(config.Memory, 5)
  })

  it('Is ok with no api config', () => {
    const config = load.api()
    assert.strictEqual(config, null)
  })
})
