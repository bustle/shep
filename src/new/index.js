import { mkdirp, writeFile, exists } from '../util/modules/fs'
import { getRole, createRole, attachPolicy } from '../util/aws/iam'
import * as templates from './templates'
import Promise from 'bluebird'
import exec from '../util/modules/exec'
import listr from '../util/modules/listr'

let conflictingFiles = false

export default function run (opts) {
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
      task: () => mkdirp(path)
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
      task: npmInstall
    }
  ]

  if (!rolename) tasks = tasks.splice(1)

  return listr(tasks, opts.quiet)
  .run({ path, rolename, region })
  .then(() => {
    if (conflictingFiles) { console.log('Conflicting files were found in provided path. New files were written with .shep-tmp appended to the filename') }
  })
}

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
    return Promise.reject(new Error('Current AWS User does not have sufficient permissions to do this'))
  })
}

function createSubDirs ({ path }) {
  return Promise.all([
    mkdirp(path + '/functions')
  ])
}

function createFiles ({ path, arn, region }) {
  const accountId = (/[0-9]{12}(?=:)/.exec(arn) || [ '' ])[0]
  const files = [
    { path: `${path}/package.json`, contents: templates.pkg({ apiName: path, region, accountId }) },
    { path: `${path}/.gitignore`, contents: templates.gitignore() },
    { path: `${path}/.env`, contents: templates.dotEnv() },
    { path: `${path}/README.md`, contents: templates.readme(path) },
    { path: `${path}/lambda.json`, contents: templates.lambda(arn) },
    { path: `${path}/api.json`, contents: templates.api(path) },
    { path: `${path}/webpack.config.js`, contents: templates.webpack() },
    { path: `${path}/.babelrc`, contents: templates.babelrc() }
  ]

  return Promise.map(files, tempifyFile)
  .map(({ path, contents }) => {
    return writeFile(path, contents)
  })
}

async function tempifyFile ({ path, contents }) {
  if (await exists(path)) {
    conflictingFiles = true
    return { path: `${path}.shep-tmp`, contents }
  }
  return { path, contents }
}

function npmInstall ({ path }) {
  return exec('npm install', { cwd: path })
}
