import { createHash } from 'crypto'

export default function (file) {
  const hash = createHash('sha256')
  hash.update(file)
  return hash.digest('hex')
}
