import { createHash } from 'crypto'
import { readFile } from 'fs'
import glob from 'glob'

export default async function (path) {
  const hash = createHash('sha256')
  const files = glob.sync(path + '/*')

  await Promise.map(files, readFile).each(hash.update)

  return hash.digest('hex')
}
