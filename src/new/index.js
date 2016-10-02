import { mkdir, writeFile } from '../util/modules/fs'
import * as templates from './templates'
import Promise from 'bluebird'
import exec from '../util/modules/exec'
import listr from '../util/modules/listr'

export default function run(opts) {
  const path = opts.path

  const tasks = listr([
    {
      title: `Create ${path}/`,
      task: () => mkdir(path)
    },
    {
      title: 'Create Subdirectories',
      task: () => createSubDirs(path)
    },
    {
      title: 'Create Files',
      task: () => createFiles(path)
    },
    {
      title: 'Install Depedencies',
      task: () => npmInstall(path)
    },
    {
      title: 'Initialize Git',
      task: () => initGit(path)
    }
  ], opts.quiet)

  return tasks.run()
}

function createSubDirs(path){
  return Promise.all([
    mkdir(path + '/functions'),
    mkdir(path + '/config')
  ])
}


function createFiles(path){
  return Promise.all([
    writeFile(path + '/package.json', templates.pkg(path)),
    writeFile(path + '/config/development.js', templates.env('development')),
    writeFile(path + '/config/beta.js', templates.env('beta')),
    writeFile(path + '/config/production.js', templates.env('production')),
    writeFile(path + '/.gitignore', templates.gitignore()),
    writeFile(path + '/README.md', templates.readme(path)),
    writeFile(path + '/lambda.json', templates.lambda()),
    writeFile(path + '/api.json', templates.api(path)),
    writeFile(path + '/webpack.config.js', templates.webpack())
  ])
}

function npmInstall(path){
  return exec('npm', ['install'], { cwd: path })
}

function initGit(path){
  return exec('git', ['init'], { cwd: path })
}
