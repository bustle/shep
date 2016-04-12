import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

const apiName = 'test-api'

let fs, apiGateway, exec, pull

test.before(()=> {
  fs = td.replace('../../src/util/fs')
  apiGateway = td.replace('../../src/util/api-gateway')
  exec = td.replace('../../src/util/exec')
  pull = td.replace('../../src/pull/exec')

  td.when(fs.mkdirAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(fs.writeFileAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(exec(td.matchers.anything()), { ignoreExtraArgs: true}).thenReturn(Promise.resolve())
  td.when(apiGateway.createRestApi(td.matchers.contains(apiName))).thenReturn(Promise.resolve({id: 'test-api-id'}))
  td.when(pull(td.matchers.contains({id: 'test-api-id'}))).thenReturn(Promise.resolve({}))

  const newProj  = require('../../src/new/exec')

  return newProj({ folder: 'test-api', apiName, region: 'us-east-1' })
})

test('Creates an API on AWS', () => {
  td.verify(apiGateway.createRestApi(), { times: 1, ignoreExtraArgs: true })
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
test('Creates a development env file', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('development.env'), td.matchers.isA(String)))
})
test('Creates a beta env file', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('beta.env'), td.matchers.isA(String)))
})
test('Creates a production env file', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('production.env'), td.matchers.isA(String)))
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
test('Pulls the latest api', () => {
  td.verify(pull(td.matchers.contains({apiId: "test-api-id", output: "test-api/api.json"})))
})
