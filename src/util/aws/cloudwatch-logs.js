import AWS from './'

export function getLogGroup ({ functionName }) {
  const cwLogs = new AWS.CloudWatchLogs()
  const expetedName = `/aws/lambda/${functionName}`

  const params = {
    logGroupNamePrefix: expetedName
  }

  return cwLogs.describeLogGroups(params).promise().get('logGroups')
  .then((groups) => groups.filter((logGroup) => logGroup.logGroupName === expetedName))
  .get(0)
  .get('logGroupName')
}

export function getLogStreams ({ logGroupName, functionVersion }) {
  const cwLogs = new AWS.CloudWatchLogs()
  const versionRegExp = new RegExp(`\\[${functionVersion}\\]`)

  // LastEventTime isn't always accurate
  const params = {
    logGroupName,
    orderBy: 'LastEventTime',
    descending: true
  }

  return cwLogs.describeLogStreams(params).promise()
  .get('logStreams')
  .filter((stream) => versionRegExp.test(stream.logStreamName))
  .map((x) => x.logStreamName)
}

export function getLogEvents ({ logGroupName, logStreamNames, start, end }) {
  const cwLogs = new AWS.CloudWatchLogs()

  const params = {
    logGroupName,
    logStreamNames,
    startTime: start,
    endTime: end,
    interleaved: true
  }

  return cwLogs.filterLogEvents(params).promise()
  .get('events')
}
