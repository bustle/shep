import inquirer from 'inquirer'
import listr from '../../util/modules/listr'
import configSet from '../../config-set'
import * as load from '../../util/load'
import merge from 'lodash.merge'

export const command = 'set <vars...>'
export const desc = 'Set environment variables for alias on AWS'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .boolean('quiet')
  .alias('quiet', 'q')
  .describe('quiet', 'Don\'t log anything')
  .example('shep config set --env beta FOO=bar', 'Set environment variable FOO with value BAR for alias beta')
}

export async function handler (opts) {
  let envVars = {}
  opts.vars.forEach(function (varPair) {
    const [key, value] = varPair.match(/(.*?)=(.*)/).slice(1)
    envVars[key] = value
  })
  opts.vars = envVars
  const inputs = {}

  if (!opts.env) {
    const envs = await load.envs()
    const questions = [
      {
        name: 'env',
        message: 'Environment',
        type: 'list',
        choices: () => envs
      }
    ]

    merge(inputs, await inquirer.prompt(questions))
  }

  return listr([
    {
      title: 'Set environment variables on functions in AWS',
      task: () => configSet(merge({}, inputs, opts))
    }
  ], opts.quiet).run()
}
