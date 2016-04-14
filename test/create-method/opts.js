import test from 'ava'

const createMethod = require('../../src/create-method/exec')

test('Rejects when both resourceId and resourcePath are provided', (t) => {
  t.throws(createMethod({resourceId: 'aasdf', resourcePath: '/' }))
})
