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

export function getLogStream ({ logGroupName, functionVersion }) {
  const cwLogs = new AWS.CloudWatchLogs()

  const params = {
    logGroupName,
    orderBy: 'LastEventTime',
    descending: true
  }

  return cwLogs.describeLogStreams(params).promise()
  .get('logStreams')
  .get(0)
  .get('logStreamName')
}

export function getLogEvents ({ logGroupName, logStreamName, start, end }) {
  const cwLogs = new AWS.CloudWatchLogs()

  const params = {
    logGroupName,
    logStreamName,
    startTime: start,
    endTime: end,
    startFromHead: true
  }

  return cwLogs.getLogEvents(params).promise()
  .get('events')
}
