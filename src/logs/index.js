import Promise from 'bluebird'
import { updateRegion } from '../modules/aws'
import { getLogGroup } from '../modules/aws/cloudwatch-logs'
import { getAliasVersion } from '../modules/aws/lambda'
import getLogs from '../util/get-logs'
import { pkg } from '../util/load'
import genName from '../util/generate-name'

export default function (opts) {
  updateRegion({ region })

  const functionName = genName(opts.name).fullName
  const aliasName = opts.stage
  const stream = opts.stream
  const region = opts.region || pkg().shep.region

  return Promise.join(getLogGroup({ functionName }), getAliasVersion({ functionName, aliasName }),
    (logGroupName, functionVersion) => getLogs({ logGroupName, functionVersion, stream }))
  .then(printEventsLoop)
}

function printEventsLoop ({ events, nextLogCall }) {
  const rate = 500

  if (events !== undefined && events.length !== 0) {
    console.log(events.map(formatEvent).join(''))
  }

  if (nextLogCall === undefined) {
    return Promise.resolve()
  }

  return Promise.delay(rate)
  .then(nextLogCall)
  .then(printEventsLoop)
}

function formatEvent ({ timestamp, message }) {
  return `[${new Date(timestamp).toTimeString()}]: ${message}`
}
