import test from 'ava'
import { create } from '../helpers/fixture'
import build from '../../src/build'
import generateFunction from '../../src/generate/function'
import dirExists from '../helpers/dir-exists'
import fileExists from '../helpers/file-exists'

// Supress observetory output
require('observatory').settings({ write: () => {} })

const env = 'development'

test.before(() => {
  return create('build')
  .then(() => generateFunction({ name: 'foo' }) )
  .then(() => build({env}) )
})

test(() => dirExists('dist/foo') )
test(() => fileExists('dist/foo/index.js') )

test('Throws error with no matches', (t) => {
  t.throws(() => build({ env, functions: ['not-found'] }), /No functions found matching patterns/ )
})
