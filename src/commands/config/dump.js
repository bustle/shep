import inquirer from 'inquirer'
import configDump from '../../config-dump'
import * as load from '../../util/load'
import merge from 'lodash.merge'

export const command = 'dump [env]'
export const desc = 'Prints all environmental variables as a JSON object'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .example('shep config dump beta', 'List environment variables for function "foo" beta alias')
}

export async function handler (opts) {
  const envs = await load.envs()
  let questions

  if (envs && envs.length > 0) {
    questions = [
      {
        name: 'env',
        message: 'Environment',
        type: 'list',
        choices: () => envs
      }
    ]
  } else {
    if (!opts.env) { throw new Error('No API found, cannot load available aliases') }
  }

  inquirer.prompt(questions.filter((q) => !opts[q.name]))
  .then((inputs) => merge({}, inputs, opts))
  .then(configDump)
}