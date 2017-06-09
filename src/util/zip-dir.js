import Promise from 'bluebird'
import Zipit from 'zipit'
import { readdir } from './modules/fs'

export default async function (path) {
  const files = await readdir(path).map((file) => `${path}/${file}`)
  return new Promise((resolve, reject) => {
    Zipit({
      input: files
    }, (err, buffer) => {
      if (err) { reject(err) }
      resolve(buffer)
    })
  })
}
