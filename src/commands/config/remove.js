import inquirer from 'inquirer'
import configRemove from '../../config-remove'
import * as load from '../../util/load'
import merge from 'lodash.merge'

export const command = 'remove <vars...>'
export const desc = 'Remove environment variables for alias on AWS'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .describe('env', 'Specifies which environment to remove variables from. If not provided an interactive menu will display the options')
  .example('shep config remove --env beta NEW_VARIABLE', 'Removes NEW_VARIABLE from all functions with beta alias')
}

export async function handler (opts) {
  const envs = await load.envs()

  if (envs && envs.length > 0) {
    const questions = [
      {
        name: 'env',
        message: 'Environment',
        type: 'list',
        choices: () => envs
      }
    ]

    inquirer.prompt(questions.filter((q) => !opts[q.name]))
    .then((inputs) => merge({}, inputs, opts))
    .then(configRemove)
  } else if (!opts.env) {
    throw new Error('Unable to load environments, please provide a specific one via the --env flag')
  }
}
