import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

let fs, deploy

test.before(()=> {
  fs = td.replace('../../src/util/fs')
  deploy = td.replace('../../src/deploy-function/exec')

  td.when(fs.mkdirAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(fs.writeFileAsync(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(deploy(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))

  const createFunction  = require('../../src/create-function/exec')

  return createFunction({ name: 'test' })
})


test('Creates 1 folder', () => {
  td.verify(fs.mkdirAsync(), { times: 1, ignoreExtraArgs: true })
})
test('Creates the function folder', () => {
  td.verify(fs.mkdirAsync('functions/test'))
})

test('Creates only 4 files', () => {
  td.verify(fs.writeFileAsync(), { times: 4, ignoreExtraArgs: true })
})
test('Creates a index.js', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('index.js'), td.matchers.isA(String)))
})
test('Creates a package.json', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('package.json'), td.matchers.isA(String)))
})
test('Creates a lambda.json', () => {
  td.verify(fs.writeFileAsync(td.matchers.contains('lambda.json'), td.matchers.isA(String)))
})


test('Deploys the function', () => {
  td.verify(deploy(td.matchers.isA(Object)), { ignoreExtraArgs: true })
})
