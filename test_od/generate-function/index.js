import test from 'ava'
import { createdDir, wroteFile, fs } from '../helpers/fs'
import td from '../helpers/testdouble'

const name = 'foo-func'

td.when(fs.readJSONSync('package.json')).thenReturn({ name: 'bar' })

test.before(() => {
  const shep = require('../../src/index')
  return shep.generateFunction({ name, quiet: true })
})

test(createdDir, `functions/${name}`)
test(createdDir, `functions/${name}/events`)
test(wroteFile, `functions/${name}/events/default.json`)
test(wroteFile, `functions/${name}/index.js`)
test(wroteFile, `functions/${name}/lambda.json`)
