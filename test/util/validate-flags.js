import test from 'ava'

const validateFlags = require('../../src/util/validate-flags')

test('invalid', (t) => {
  const opts = [{
    name: 'test',
    validate: (input) => input === 'foo'
  }]

  t.throws(validateFlags({test: 'bar'}, opts), /Invalid option/)
})

test('valid flag', (t) => {
  const opts = [{
    name: 'test',
    validate: (input) => input === 'bar'
  }]

  t.notThrows(validateFlags({test: 'bar'}, opts))
})
