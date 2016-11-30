import { mkdirp, writeFile } from '../util/modules/fs'
import genName from '../util/generate-name'
import * as templates from './templates'
import listr from '../util/modules/listr'
import Promise from 'bluebird'

export default function (opts) {
  const { shortName, fullName } = genName(opts.name)

  const tasks = listr([
    {
      title: `Create functions/${shortName}/`,
      task: () => mkdirp(`./functions/${shortName}`)
    },
    {
      title: `Create functions/${shortName}/events`,
      task: () => mkdirp(`./functions/${shortName}/events`)
    },
    {
      title: 'Create files',
      task: () => createFiles(shortName)
    }
  ], opts.quiet)

  return tasks.run()

  function createFiles () {
    return Promise.all([
      writeFile(`./functions/${shortName}/index.js`, templates.index()),
      writeFile(`./functions/${shortName}/lambda.json`, templates.lambda(fullName)),
      writeFile(`./functions/${shortName}/events/default.json`, templates.event())
    ])
  }
}
