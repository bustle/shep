import inquirer from 'inquirer'
import configSet from '../../config-set'
import * as load from '../../util/load'
import merge from 'lodash.merge'

export const command = 'set <env> <vars...>'
export const desc = 'Set environment variables for alias on AWS'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .example('shep config set beta FOO=bar', 'Set environment variable FOO with value BAR for alias beta')
}

export function handler (opts) {
  let envVars = {}
  opts.vars.forEach((varPair) => {
    const split = varPair.split('=')
    envVars[split[0]] = split[1]
  })
  opts.vars = envVars

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
  .then(configSet)
}
