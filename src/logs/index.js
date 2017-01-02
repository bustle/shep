import Promise from 'bluebird'
import AWS from '../util/aws'
import { getLogGroup, getLogStreams, getLogEvents } from '../util/aws/cloudwatch-logs'
import { getAliasVersion } from '../util/aws/lambda'
import { pkg } from '../util/load'
import genName from '../util/generate-name'

export default function (opts) {
  const functionName = genName(opts.name).fullName
  const aliasName = opts.stage
  const rate = 250 // note this can't go under 200 as we're limited to 5 requests/sec
  const stream = opts.stream
  const region = opts.region || pkg().shep.region

  AWS.config.update({ region })

  // Should gracefully handle if function doesn't exist
  return Promise.all([getLogGroup({ functionName }), getAliasVersion({ functionName, aliasName })])
  .spread((logGroupName, functionVersion) => showLogs({ logGroupName, functionVersion, rate, stream }))
}

function showLogs ({ logGroupName, functionVersion, rate, start = Date.now(), stream }) {
  const tailCall = tailCallGenerator({ logGroupName, functionVersion, rate, stream })

  return getLogStreams({ logGroupName, functionVersion })
  .then((logStreamNames) => getLogEvents({ logGroupName, logStreamNames, start }))
  .tap((events) => { if (events.length !== 0) console.log(events.map(formatEvent).join('')) })
  .reduce((latest, event) => Math.max(latest, event.timestamp), start)
  .then((timestamp) => timestamp === start ? start : timestamp + 1) // If timestamp from new event, increase start time to avoid duplicate events
  .then(tailCall)
}

function tailCallGenerator ({ logGroupName, functionVersion, rate, stream }) {
  if (stream) {
    return (lastTimestamp) => Promise.delay(rate).then(() => showLogs({ logGroupName, functionVersion, rate, stream, start: lastTimestamp }))
  }
  return () => Promise.resolve()
}

function formatEvent ({ timestamp, message }) {
  return `[${new Date(timestamp).toTimeString()}]: ${message}`
}
