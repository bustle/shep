import { all } from 'bluebird'
import fs from 'fs-extra-promise'
import * as templates from './templates'

export default function(opts) {

  const name = opts.name

  return createDirs()
  .then(createFiles)

  function createDirs(){
    return fs.ensureDirAsync(`./functions/${name}`)
    .then(() => fs.ensureDirAsync(`./functions/${name}/events`) )
  }

  function createFiles(){
    return all([
      fs.writeFileAsync(`./functions/${name}/index.js`, templates.index()),
      fs.writeFileAsync(`./functions/${name}/lambda.json`, templates.lambda(name)),
      fs.writeFileAsync(`./functions/${name}/events/default.json`, templates.event())
    ])
  }
}
