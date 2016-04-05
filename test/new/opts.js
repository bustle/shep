import test from 'ava'

test('--no-interactive --no-api', (t) => {
  const shep  = require('../../src/index')

  // TODO Check missing flags
  t.throws(shep.new({ interactive: false, api: false }), /Missing flags/)
})

test('--no-interactive', (t) => {
  const shep  = require('../../src/index')

  // TODO Check missing flags
  t.throws(shep.new({ interactive: false }), /Missing flags/)
})
