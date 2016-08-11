import Promise from 'bluebird'
import fs from 'fs-extra-promise'
import * as templates from './templates'

/**
 * @param opts Options for this command.
 * @param opts.path The path where the project should be generated.
 */
export default function run(opts) {
  const path = opts.path

  return createFolders()
  .then(createFiles)

  function createFolders(){
    return Promise.all([
      fs.ensureDirAsync(path + '/functions'),
      fs.ensureDirAsync(path + '/config')
    ])
  }

  function createFiles() {
    let files = [
      fs.outputFileAsync(path + '/package.json', templates.pkg(path, opts.api)),
      fs.outputFileAsync(path + '/config/development.js', templates.env('development')),
      fs.outputFileAsync(path + '/config/beta.js', templates.env('beta')),
      fs.outputFileAsync(path + '/config/production.js', templates.env('production')),
      fs.outputFileAsync(path + '/.gitignore', templates.gitignore()),
      fs.outputFileAsync(path + '/README.md', templates.readme(path)),
      fs.outputFileAsync(path + '/lambda.json', templates.lambda()),
      fs.outputFileAsync(path + '/api.json', templates.api(path)),
      fs.outputFileAsync(path + '/webpack.config.js', templates.webpack())
    ]

    return Promise.all(files)
  }
}
