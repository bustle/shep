import test from 'ava'
import td from '../helpers/testdouble'

const funcNames = ['foo', 'bar']
const handler = 'handler'
const config = { Handler: `index.${handler}` }
const events = [{}]
const lambdaFunc = td.object([handler])
td.when(lambdaFunc[handler](td.matchers.isA(Object), td.matchers.isA(Object))).thenCallback(null, 'bar')

const load = td.replace('../../src/util/load')
td.when(load.funcs(td.matchers.anything())).thenReturn(funcNames)
td.when(load.lambdaConfig(td.matchers.anything())).thenReturn(config)
td.when(load.events(td.matchers.anything())).thenReturn(events)

const requireProject = td.replace('../../src/util/require-project')
td.when(requireProject(td.matchers.anything())).thenReturn(lambdaFunc)

test.before(() => {
  return require('../../src/run/index')({ all: true, build: false })
})

test('Calls the functions', () => {
  td.verify(lambdaFunc[handler](), { times: funcNames.length, ignoreExtraArgs: true })
})

