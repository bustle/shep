import inquirer from 'inquirer'
import configRemove from '../../config-remove'
import * as load from '../../util/load'
import listr from '../../util/modules/listr'
import merge from 'lodash.merge'

export const command = 'remove <vars...>'
export const desc = 'Remove environment variables for alias on AWS'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .boolean('quiet')
  .alias('quiet', 'q')
  .describe('quiet', 'Don\'t log anything')
  .describe('env', 'Specifies which environment to remove variables from. If not provided an interactive menu will display the options')
  .example('shep config remove --env beta NEW_VARIABLE', 'Removes NEW_VARIABLE from all functions with beta alias')
}

export async function handler (opts) {
  const inputs = {}

  if (!opts.env) {
    const envs = await load.envs()
    if (envs && envs.length === 0) { throw new Error('Unable to load environments, please provide a specific one via the --env flag') }
    const questions = [
      {
        name: 'env',
        message: 'Environment',
        type: 'list',
        choices: () => envs
      }
    ]

    merge(inputs, await inquirer.prompt(questions.filter((q) => !opts[q.name])))
  }

  const tasks = listr([
    {
      title: 'Remove environment variables on functions in AWS',
      task: () => configRemove(merge({}, inputs, opts))
    }
  ], opts.quiet)

  return tasks.run()
}
