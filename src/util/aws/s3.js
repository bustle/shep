import AWS from './'
import loadRegion from './region-loader'

export async function putBuild (key, bucket, zip) {
  await loadRegion()
  const s3 = new AWS.S3()

  const putParams = { Bucket: bucket, Key: key, Body: zip }
  return s3.upload(putParams).promise()
}

export async function buildExists (key, bucket) {
  await loadRegion()
  const s3 = new AWS.S3()

  const getParams = { Bucket: bucket, Key: key }

  try {
    await s3.getObject(getParams).promise()
    return true
  } catch (err) {
    if (err.code === 'NoSuchKey') { return false }
    throw err
  }
}
