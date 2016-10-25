import test from 'ava'
import { createdDir, wroteFile } from '../helpers/fs'
import { didExec } from '../helpers/exec'

const path = 'foo-api'

test.before(() => {
  const shep = require('../../src/index')
  return shep.new({ path, quiet: true })
})

test(createdDir, `${path}/functions`)
test(createdDir, `${path}/functions`)
test(createdDir, `${path}/config`)

test(wroteFile, `${path}/lambda.json`)
test(wroteFile, `${path}/api.json`)
test(wroteFile, `${path}/package.json`)
test(wroteFile, `${path}/.gitignore`)
test(wroteFile, `${path}/README.md`)
test(wroteFile, `${path}/webpack.config.js`)

test(didExec, 'npm', 'install')
test(didExec, 'git', 'init')
