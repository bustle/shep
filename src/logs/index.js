import Promise from 'bluebird'
import AWS from '../util/aws'
import { getLogGroup, getLogStreams, getLogEvents } from '../util/aws/cloudwatch-logs'
import { getAliasVersion } from '../util/aws/lambda'
import { pkg } from '../util/load'
import genName from '../util/generate-name'

export default function (opts) {
  const functionName = genName(opts.name).fullName
  const aliasName = opts.stage
  const rate = opts.rate || 250 // note this can't go under 200 as we're limited to 5 requests/sec
  const stream = opts.stream
  const region = opts.region || pkg().shep.region

  AWS.config.update({ region })

  // Should gracefully handle if function doesn't exist
  return Promise.all([getLogGroup({ functionName }), getAliasVersion({ functionName, aliasName })])
  .spread((logGroupName, functionVersion) => showLogs({ logGroupName, functionVersion, rate, start: Date.now(), stream }))
}

function showLogs ({ logGroupName, functionVersion, rate, start, stream }) {
  const newStart = start + rate

  return getLogStreams({ logGroupName, functionVersion })
  .then((streams) => getLogEvents({ logGroupName, streams, start }))
  .map(formatEvent)
  .then(() => { if (stream) return Promise.delay(rate).then(() => showLogs({ logGroupName, functionVersion, rate, stream, start: newStart })) })
}

function formatEvent ({ timestamp, message }) {
  return `[${timestamp}]: ${message}`
}
