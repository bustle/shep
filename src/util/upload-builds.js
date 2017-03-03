import Promise from 'bluebird'
import hashBuild from './hash-build'
import { putBuild } from './aws/s3'
import { funcs } from './load'

export default async function (pattern, bucket) {
  const fns = await funcs(pattern)
  return Promise.all(fns.map(async (func) => {
    const path = `dist/${func}`
    const hash = await hashBuild(path)
    return await putBuild(hash, path, bucket, func)
  }))
}
