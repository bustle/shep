import { getRole, createRole, attachPolicy } from '../modules/aws/iam'
import * as templates from './templates'
import Promise from 'bluebird'
import exec from '../modules/exec'
import listr from '../modules/listr'
import commandExists from '../modules/command-exists'

export default function run (modules, opts) {
  const fs = modules.fs
  const path = opts.path
  const rolename = opts.rolename
  const region = opts.region

  let tasks = [
    {
      title: `Setup IAM Role`,
      task: setupIam
    },
    {
      title: `Create ${path}/`,
      task: () => fs.mkdirp(path)
    },
    {
      title: 'Create Subdirectories',
      task: createSubDirs
    },
    {
      title: 'Create Files',
      task: createFiles
    },
    {
      title: 'Install Depedencies',
      task: depInstall
    }
  ]

  if (!rolename) tasks = tasks.splice(1)

  return listr(tasks, opts.quiet)
    .run({ path, rolename, region })

  function setupIam (context) {
    const rolename = context.rolename
    let newRole = false

    return getRole(rolename)
    .catch({ code: 'NoSuchEntity' }, () => {
      newRole = true
      return createRole(rolename)
    })
    .tap(arn => {
      context.arn = arn
    })
    .then(() => { if (newRole) return attachPolicy(rolename) })
    .catch({ code: 'LimitExceeded' }, () => {
      return Promise.reject('Current AWS User does not have sufficient permissions to do this')
    })
  }

  function createSubDirs () {
    return Promise.all([
      fs.mkdirp(path + '/functions'),
      fs.mkdirp(path + '/environments')
    ])
  }

  function createFiles ({ path, arn, region }) {
    const accountId = (/[0-9]{12}(?=:)/.exec(arn) || [ '' ])[0]

    return Promise.all([
      fs.writeFile(path + '/package.json', templates.pkg({ apiName: path, region, accountId })),
      fs.writeFile(path + '/environments/development.json', templates.env('development')),
      fs.writeFile(path + '/environments/beta.json', templates.env('beta')),
      fs.writeFile(path + '/environments/production.json', templates.env('production')),
      fs.writeFile(path + '/.gitignore', templates.gitignore()),
      fs.writeFile(path + '/README.md', templates.readme(path)),
      fs.writeFile(path + '/lambda.json', templates.lambda(arn)),
      fs.writeFile(path + '/api.json', templates.api(path)),
      fs.writeFile(path + '/webpack.config.js', templates.webpack()),
      fs.writeFile(path + '/.babelrc', templates.babelrc())
    ])
  }
}

async function depInstall ({ path }) {
  const exists = await commandExists('yarn')
  const command = exists ? 'yarn' : 'npm install'
  return exec(command, { cwd: path })
}
