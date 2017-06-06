import Promise from 'bluebird'
import Zipit from 'zipit'

export default function (path) {
  return new Promise((resolve, reject) => {
    Zipit({
      input: path
    }, (err, buffer) => {
      if (err) { reject(err) }
      resolve(buffer)
    })
  })
}
