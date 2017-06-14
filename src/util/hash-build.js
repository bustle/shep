import Promise from 'bluebird'
import { createHash } from 'crypto'
import { readFile } from './modules/fs'
import glob from 'glob'

export default async function (path) {
  const hash = createHash('sha256')
  const files = glob.sync(path + '/*')

  const fileContents = await Promise.map(files, (f) => readFile(f))
  fileContents.forEach((file) => hash.update(file))

  return hash.digest('hex')
}
