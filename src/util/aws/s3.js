import AWS from './'

export function putBuild (hash, path, bucket, func) {
  const s3 = new AWS.S3()

  const getParams = { Bucket: bucket, Key: hash }
  const putParams = { ...getParams, Body: path }

  return s3.getObject(getParams).promise()
  .then(() => {
    return null
  })
  .catch({ code: 'NoSuchKey' }, () => {
    return s3.upload(putParams).promise().then(() => { return func })
  })
  .catch((e) => {
    throw new Error(e)
  })
}
