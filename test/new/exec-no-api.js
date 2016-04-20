import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

let fs, apiGateway, exec, pull

test.before(()=> {
  fs = td.replace('../../src/util/fs')
  apiGateway = td.replace('../../src/util/api-gateway')
  exec = td.replace('../../src/util/exec')
  pull = td.replace('../../src/pull/exec')

  td.when(fs.mkdirAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(fs.writeFileAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(exec(td.matchers.anything()), { ignoreExtraArgs: true}).thenReturn(Promise.resolve())

  const newProj  = require('../../src/new/exec')

  return newProj({ folder: 'test-api', api: false, region: 'us-east-1' })
})

test('Does not creates an API on AWS', () => {
  td.verify(apiGateway.createRestApi(), {times: 0, ignoreExtraArgs: true})
})

test('Creates only 3 folders', () => {
  td.verify(fs.mkdirAsync(), { times: 3, ignoreExtraArgs: true })
})
test('Creates project folder', () => {
  td.verify(fs.mkdirAsync('test-api'))
})
test('Creates a function folder', () => {
  td.verify(fs.mkdirAsync('test-api/functions'))
})
test('Creates a config folder', () => {
  td.verify(fs.mkdirAsync('test-api/config'))
})

test('Creates only 6 files', () => {
  td.verify(fs.writeFileAsync(), { times: 6, ignoreExtraArgs: true })
})
test('Creates a README', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('README.md'), td.matchers.isA(String)))
})
test('Creates a package.json', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('package.json'), td.matchers.isA(String)))
})
test('Creates a development json file', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('config/development.json'), td.matchers.isA(String)))
})
test('Creates a beta json file', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('config/beta.json'), td.matchers.isA(String)))
})
test('Creates a production json file', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('config/production.json'), td.matchers.isA(String)))
})
test('Creates a gitignore', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('.gitignore'), td.matchers.isA(String)))
})

test('Calls exec only twice', () => {
  td.verify(exec(), { times: 2, ignoreExtraArgs: true })
})
test('Creates an initial git commit', () => {
  td.verify(exec(td.matchers.contains('git commit'), td.matchers.isA(Object)))
})
test('Runs npm install', () => {
  td.verify(exec(td.matchers.contains('npm install'), td.matchers.isA(Object)))
})
test('Does not pull the latest api', () => {
  td.verify(pull(), { times: 0, ignoreExtraArgs: true })
})
