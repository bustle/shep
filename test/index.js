import test from 'ava'

const Promise = require('bluebird')
const td = require('testdouble')

test.afterEach(() => { td.reset() })

test('[cmd]', () => {
  const prompt = td.function()
  const exec = td.function()

  td.when(prompt(td.matchers.anything())).thenReturn(Promise.resolve({}))
  td.when(exec(), {ignoreExtraArgs: true}).thenReturn(Promise.resolve())
  td.replace('../src/util/prompt', prompt)
  td.replace('../src/new/exec', exec)

  const shep  = require('../src/index')

  return shep.new().then(()=>{
    td.verify(prompt(td.matchers.isA(Array)))
    td.verify(exec(td.matchers.isA(Object)), {ignoreExtraArgs: true})
  })
})

test('[cmd] --help', () => {
  const printHelp = td.replace('../src/util/print-help')
  td.when(printHelp(td.matchers.isA(String), td.matchers.isA(Object))).thenReturn(Promise.resolve({}))

  const shep  = require('../src/index')

  return shep.new({ help: true }).then(()=>{
    td.verify(printHelp(td.matchers.isA(String), td.matchers.isA(Object)))
  })
})
