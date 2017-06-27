import uuid from 'uuid'

export default function (config) {
  const id = uuid.v1()
  const stream = uuid.v4().replace(/-/g, '')

  const timeout = config.Timeout || 10
  const region = config.region || 'us-east-1'
  const functionName = config.FunctionName || 'foo'
  const functionVersion = config.Version || '$LATEST'
  const memoryLimitInMB = config.MemorySize || '128'
  const account = config.account || 123456789012

  const start = new Date()

  const ctx = {
    succeed: () => { throw new Error('This is no longer supported, use callbacks instead') },
    fail: () => { throw new Error('This is no longer supported, use callbacks instead') },
    done: () => { throw new Error('This is no longer supported, use callbacks instead') },
    getRemainingTimeInMillis: () => {
      const current = new Date()
      const remaining = (current.getTime() + timeout * 1000) - start.getTime()
      return Math.max(0, remaining)
    },
    callbackWaitsForEmptyEventsLoop: true,
    functionName,
    functionVersion,
    memoryLimitInMB,
    awsRequestId: id,
    logGroupName: `/aws/lambda/${functionName}`,
    logStreamName: `${new Date()}/[${functionVersion}]/${stream}`,
    timeout,
    invokedFunctionArn: `arn:aws:lambda:${region}:${account}:function:${functionName}:${functionVersion}`
  }

  const callbackWrapper = (cbFn) => {
    let callbackCalled = false

    const timer = setTimeout(() => {
      if (!callbackCalled) { throw new Error(`Lambda function ${functionName} timed out`) }
    }, config.Timeout * 1000)

    return (...args) => {
      callbackCalled = true
      clearTimeout(timer)
      cbFn(...args)
    }
  }

  return { context: ctx, callbackWrapper }
}
