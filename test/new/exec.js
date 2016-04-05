import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

const apiName = 'test-api'

let fs, apiGateway

test.before(()=> {
  fs = td.replace('../../src/util/fs')
  apiGateway = td.replace('../../src/util/api-gateway')

  td.when(fs.mkdirAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(fs.writeFileAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(apiGateway.createRestApi(td.matchers.contains(apiName))).thenReturn(Promise.resolve({id: 'test-api-id'}))

  const newProj  = require('../../src/new/exec')

  return newProj({ folder: 'test-api', apiName, region: 'us-east-1' })
})

test('Creates an API on AWS', () => {
  td.verify(apiGateway.createRestApi(), { times: 1, ignoreExtraArgs: true })
})

test('Creates only 2 folders', () => {
  td.verify(fs.mkdirAsync(), { times: 2, ignoreExtraArgs: true })
})
test('Creates project folder', () => {
  td.verify(fs.mkdirAsync('test-api'))
})
test('Creates a function folder', () => {
  td.verify(fs.mkdirAsync('test-api/functions'))
})

test('Creates only 5 files', () => {
  td.verify(fs.writeFileAsync(), { times: 5, ignoreExtraArgs: true })
})
test('Creates a README', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('README.md'), td.matchers.isA(String)))
})
test('Creates a package.json', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('package.json'), td.matchers.isA(String)))
})
test('Creates a env file', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('env.js'), td.matchers.isA(String)))
})
test('Creates a example env file', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('env.js.example'), td.matchers.isA(String)))
})
test('Creates a gitignore', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('.gitignore'), td.matchers.isA(String)))
})
