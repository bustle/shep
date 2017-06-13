import inquirer from 'inquirer'
import configSet from '../../config-set'
import * as load from '../../util/load'
import merge from 'lodash.merge'

export const command = 'set <vars...>'
export const desc = 'Set environment variables for alias on AWS'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .example('shep config set --env beta FOO=bar', 'Set environment variable FOO with value BAR for alias beta')
}

export async function handler (opts) {
  let envVars = {}
  opts.vars.forEach(function (varPair) {
    const [key, value] = varPair.match(/(.*?)=(.*)/).slice(1)
    envVars[key] = value
  })
  opts.vars = envVars

  if (opts.env) {
    configSet(opts)
  } else {
    const envs = await load.envs()
    const questions = [
      {
        name: 'env',
        message: 'Environment',
        type: 'list',
        choices: () => envs
      }
    ]

    inquirer.prompt(questions)
      .then((inputs) => merge({}, inputs, opts))
      .then(configSet)
  }
}
