import Promise from 'bluebird'
import { updateFunction } from './aws/lambda'
import { lambdaConfig, distPath } from './load'

export default async function (fns, env) {
  return Promise.map(fns, async ({ name, key, bucket }) => {
    const config = await lambdaConfig(name)
    return updateFunction(env, config, { S3Bucket: bucket, S3Key: key })
  })
}
