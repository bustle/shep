import { getLogStreams, getLogEvents } from './aws/cloudwatch-logs'

async function getLogs ({ logGroupName, functionVersion, stream, start = Date.now() }) {
  const logStreamNames = await getLogStreams({ logGroupName, functionVersion })
  const recievedEvents = await getLogEvents({ logGroupName, logStreamNames, start })

  const timestamp = recievedEvents.reduce(maxTimestamp, start)
  // If timestamp from new event, increase start time to avoid duplicate events
  const lastTimestamp = timestamp === start ? timestamp : timestamp + 1

  return {
    events: recievedEvents,
    nextLogCall: tailCallGenerator({ logGroupName, functionVersion, stream, lastTimestamp })
  }
}

function tailCallGenerator ({ logGroupName, functionVersion, stream, lastTimestamp }) {
  if (stream) {
    return () => getLogs({ logGroupName, functionVersion, stream, start: lastTimestamp })
  }
  return () => Promise.resolve({})
}

function maxTimestamp (latest, event) {
  return Math.max(latest, event.timestamp)
}

export default getLogs
