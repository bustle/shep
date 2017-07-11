import Promise from 'bluebird'
import zipDir from './zip-dir'
import { putFunction } from './aws/lambda'
import { lambdaConfig, distPath } from './load'

export default async function (fns, env) {
  return Promise.map(fns, async ({ name, key, bucket }) => {
    const zip = key && bucket ? undefined : await zipDir(await distPath(name))
    const config = await lambdaConfig(name)
    return putFunction(env, config, { ZipFile: zip, S3Bucket: bucket, S3Key: key })
  })
}
