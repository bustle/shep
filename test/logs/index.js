import test from 'ava'
import td from '../helpers/testdouble'

const env = 'development'
const region = 'us-east-1'
const functionName = 'foo'
const aliasName = 'beta'
const functionVersion = 6
const logGroupName = `/aws/lambda/${functionName}`
const start = Date.now()
const streams = []

const cloudwatchLogs = td.replace('../../src/util/aws/cloudwatch-logs')
const lambda = td.replace('../../src/util/aws/lambda')

td.when(cloudwatchLogs.getLogGroup({ functionName })).thenReturn(Promise.resolve(logGroupName))
td.when(lambda.getAliasVersion(aliasName)).thenReturn(Promise.resolve(functionVersion))
td.when(cloudwatchLogs.getLogStreams({ logGroupName, functionVersion })).thenReturn(Promise.resolve(streams))

test.before(() => {
  const shep = require('../../src/index')
  shep.logs({ env, functionName, stream: false, region })
})

test('Logs to console', () => {
  td.verify(cloudwatchLogs.getLogEvents({ logGroupName, streams, start }))
})
