import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import glob from 'glob'

export default async function (path) {
  const hash = createHash('sha256')
  const files = glob.sync(path + '/*')

  files.map((file) => {
    const data = readFileSync(file)
    hash.update(data)
  })

  return hash.digest('hex')
}
