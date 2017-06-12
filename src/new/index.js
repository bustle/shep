import { mkdirp, writeFile, exists } from '../util/modules/fs'
import { getRole, createRole, attachPolicy } from '../util/aws/iam'
import * as templates from './templates'
import Promise from 'bluebird'
import exec from '../util/modules/exec'
import listr from '../util/modules/listr'

let conflictingFiles = false

export default async function run (opts) {
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

  await listr(tasks, opts.quiet).run({ path, rolename, region })
  if (conflictingFiles) { console.log('Conflicting files were found in provided path. New files were written with .shep-tmp appended to the filename') }
}

async function setupIam (context) {
  const rolename = context.rolename

  try {
    context.arn = await getRole(rolename)
    return context.arn
  } catch (e) {
    if (e.code !== 'NoSuchEntity') { throw e }
    context.arn = await createRole(rolename)
    return attachPolicy(rolename)
  }
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
  .map(({ path, contents }) => writeFile(path, contents))
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
