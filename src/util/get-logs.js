import { getLogStreams, getLogEvents } from './aws/cloudwatch-logs'

export default function getLogs ({ logGroupName, functionVersion, stream, start = Date.now() }) {
  let recievedEvents

  return getLogStreams({ logGroupName, functionVersion })
  .then((logStreamNames) => getLogEvents({ logGroupName, logStreamNames, start }))
  .tap((events) => { recievedEvents = events })
  .reduce(maxTimestamp, start)
  .then((timestamp) => timestamp === start ? timestamp : timestamp + 1) // If timestamp from new event, increase start time to avoid duplicate events
  .then((lastTimestamp) => {
    return Promise.resolve({
      events: recievedEvents,
      nextLogCall: tailCallGenerator({ logGroupName, functionVersion, stream, lastTimestamp })
    })
  })
}

function tailCallGenerator ({ logGroupName, functionVersion, stream, lastTimestamp }) {
  if (stream) {
    return () => getLogs({ logGroupName, functionVersion, stream, start: lastTimestamp })
  }
  return () => Promise.resolve()
}

function maxTimestamp (latest, event) {
  return Math.max(latest, event.timestamp)
}
