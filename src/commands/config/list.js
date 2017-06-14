import inquirer from 'inquirer'
import configList from '../../config-list'
import * as load from '../../util/load'
import merge from 'lodash.merge'

export const command = 'list'
export const desc = 'List environment variables on AWS for an alias'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .boolean('json')
  .describe('env', 'Specifies which environment. If not provided an interactive menu will display the options')
  .describe('json', 'Formats output as JSON')
  .example('shep config list --env beta', 'Print to console all environment variables of environment `beta` in JSON format')
}

export async function handler (opts) {
  const envs = await load.envs()
  const questions = [
    {
      name: 'env',
      message: 'Environment',
      type: 'list',
      choices: () => envs
    }
  ]

  if (envs && envs.length === 0 && !opts.env) {
    throw new Error('Cannot load available aliases, to create an alias use `shep deploy --env beta`')
  }

  inquirer.prompt(questions.filter((q) => !opts[q.name]))
  .then((inputs) => merge({}, inputs, opts))
  .then(configList)
}
