import test from 'ava'
import { create } from '../helpers/fixture'
import dirExists from '../helpers/dir-exists'
import fileExists from '../helpers/file-exists'

test.before(() => create('new'))

test(() => dirExists('functions'))
test(() => dirExists('config'))
test(() => fileExists('lambda.json'))
test(() => fileExists('api.json'))
test(() => fileExists('package.json'))
test(() => fileExists('.gitignore'))
test(() => fileExists('README.md'))
test(() => fileExists('webpack.config.js'))
