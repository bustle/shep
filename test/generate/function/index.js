import test from 'ava'
import { create } from '../../helpers/fixture'
import dirExists from '../../helpers/dir-exists'
import fileExists from '../../helpers/file-exists'

const name = 'foo'

test.before(() => {
  return create('generate-function')
  .then(() => {
    const generateFunction  = require('../../../src/generate/function')
    return generateFunction({ name })
  })
})

test(() => dirExists(`functions/${name}`))
test(() => dirExists(`functions/${name}/events`))
test(() => fileExists(`functions/${name}/events/default.json`))
test(() => fileExists(`functions/${name}/index.js`))
test(() => fileExists(`functions/${name}/lambda.json`))
