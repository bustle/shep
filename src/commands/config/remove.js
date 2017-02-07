import inquirer from 'inquirer'
import configRemove from '../../config-remove'
import * as load from '../../util/load'
import merge from 'lodash.merge'

export const command = 'remove <env> <vars...>'
export const desc = 'Remove environment variables for alias on AWS'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .example('shep config remove beta NEW_VARIABLE', 'Removes NEW_VARIABLE from all functions with beta alias')
}

export function handler (opts) {
  const questions = [
    {
      name: 'env',
      message: 'Environment',
      type: 'list',
      choices: () => load.envs()
    }
  ]

  inquirer.prompt(questions.filter((q) => !opts[q.name]))
  .then((inputs) => merge({}, inputs, opts))
  .then(configRemove)
}
