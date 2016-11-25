import AWS from './'

export function getLogGroup({ functionName }) {
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

export function getLogStreams({ logGroupName, functionVersion }) {
  const cwLogs = new AWS.CloudWatchLogs()
  const date = new Date()

  const params = {
    logGroupName,
    logStreamNamePrefix: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/[${functionVersion}]`
    //orderBy: 'LastEventTime'
  }

  return cwLogs.describeLogStreams(params).promise()
  .then((response) => response.logStreams.map((stream) => stream.logStreamName))
}

export function getLogEvents({ logGroupName, logStreamNames, start }) {
  const cwLogs = new AWS.CloudWatchLogs()

  const params = {
    logGroupName,
    logStreamNames,
    startTime: start
  }

  return cwLogs.filterLogEvents(params).promise()
  .get('events')
  .tap(console.log)
}
