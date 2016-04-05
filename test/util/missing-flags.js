import test from 'ava'

const missingFlags = require('../../src/util/missing-flags')

test((t) => {
  t.throws(missingFlags([{ name: 'foo'}]), /Missing flags: --foo/)
})
