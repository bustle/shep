import Promise from 'bluebird'
import { getLogGroup } from '../util/aws/cloudwatch-logs'
import { getAliasVersion } from '../util/aws/lambda'
import getLogs from '../util/get-logs'
import { lambdaConfig } from '../util/load'

export default async function (opts) {
  const { FunctionName } = await lambdaConfig(opts.name)
  const aliasName = opts.env
  const stream = opts.stream

  const [logGroupName, functionVersion] = await Promise.all([getLogGroup({ FunctionName }), getAliasVersion({ functionName: FunctionName, aliasName })])
  const logs = await getLogs({ logGroupName, functionVersion, stream })
  return printEventsLoop(logs)
}

async function printEventsLoop ({ events, nextLogCall }) {
  const rate = 500

  if (events !== undefined && events.length !== 0) {
    console.log(events.map(formatEvent).join(''))
  }

  if (nextLogCall === undefined) {
    return Promise.resolve()
  }

  await Promise.delay(rate)
  const logs = await nextLogCall()
  return printEventsLoop(logs)
}

function formatEvent ({ timestamp, message }) {
  return `[${new Date(timestamp).toTimeString()}]: ${message}`
}
