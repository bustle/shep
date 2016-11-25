import Promise from 'bluebird'
import AWS from '../util/aws'
import { getLogGroup, getLogStream, getLogEvents } from '../util/aws/cloudwatch-logs'
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
  .spread((logGroupName, functionVersion) => showLogs({ logGroupName, functionVersion, rate, stream }))
}

function showLogs ({ logGroupName, functionVersion, rate, start, end, stream }) {
  // first call of method should have all logs in logstream (to some limit)
  // following calls should only print new logs

  const newStart = end + 1 || Date.now()
  const newEnd = newStart + rate
  return getLogStream({ logGroupName, functionVersion }) // there should be a filter to select best stream?
  .then((logStreamName) => getLogEvents({ logGroupName, logStreamName, start, end }))
  .map(formatEvent)
  .then((events) => { if (events.length !== 0) console.log(events.join('\n')) })
  .then(() => { if (stream) return Promise.delay(rate).then(() => showLogs({ logGroupName, functionVersion, rate, stream, start: newStart, end: newEnd })) })
}

function formatEvent ({ timestamp, message }) {
  return `[${timestamp}]: ${message}`
}
