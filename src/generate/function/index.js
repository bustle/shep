import { all } from 'bluebird'
import fs from 'fs-extra-promise'
import * as templates from './templates'

export default function(opts) {

  const name = opts.name

  return createDir()
  .then(createFiles)

  function createDir(){
    return fs.ensureDirAsync(`./functions/${name}`)
  }

  function createFiles(){
    return all([
      fs.writeFileAsync(`./functions/${name}/index.js`, templates.index()),
      fs.writeFileAsync(`./functions/${name}/lambda.json`, templates.lambda(name)),
      fs.writeFileAsync(`./functions/${name}/event.json`, templates.event())
    ])
  }
}
