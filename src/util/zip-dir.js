import archiver from 'archiver'
import streamBuffers from 'stream-buffers'
import Promise from 'bluebird'

export default function (path) {
  return new Promise((resolve, reject) => {
    const archive = archiver.create('zip')
    let output = new streamBuffers.WritableStreamBuffer()

    output.on('finish', function () { resolve(output.getContents()) })
    archive.on('error', function (err) { reject(err) })
    archive.pipe(output)
    archive.directory(path, '/').finalize()
  })
}
