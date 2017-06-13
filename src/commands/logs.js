import inquirer from 'inquirer'
import logs from '../logs'
import * as load from '../util/load'
import merge from 'lodash.merge'

export const command = 'logs [name]'
export const desc = 'Streams logs from the specified version of a function'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .describe('env', 'Specifies which environment to use. If not provided an interactive menu will display the options.')
  .describe('name', 'Name of function to use')
  .describe('region', 'Name of region to use, uses region in `package.json` if not given')
  .boolean('stream')
  .default('stream', true)
  .describe('stream', 'Stream logs')
  .example('shep logs', 'Launch an interactive CLI')
  .example('shep logs --env production foo', 'Shows logs for the `foo` function in the production environment')
}

export async function handler (opts) {
  const envs = await load.envs()
  const fns = await load.funcs()
  const questions = []

  if (envs && envs.length > 0) {
    questions.push({
      name: 'env',
      message: 'Environment',
      type: 'list',
      choices: () => envs
    })
  } else if (!opts.env) {
    throw new Error('No aliases found, please deploy your functions before trying to look at their logs')
  }
  questions.push({
    name: 'name',
    message: 'Function',
    type: 'list',
    choices: () => fns
  })

  inquirer.prompt(questions.filter((q) => !opts[q.name]))
  .then((inputs) => merge({}, inputs, opts))
  .then(logs)
}
