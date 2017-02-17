import inquirer from 'inquirer'
import logs from '../logs'
import * as load from '../util/load'
import merge from 'lodash.merge'

export const command = 'logs [stage] [name]'
export const desc = 'Streams logs from the specified version of a function'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .describe('stage', 'Name of stage to use')
  .describe('name', 'Name of function to use')
  .describe('region', 'Name of region to use, uses region in `package.json` if not given')
  .boolean('stream', 'Stream logs')
  .default('stream', true)
  .example('shep logs', 'Launch an interactive CLI')
  .example('shep logs production foo', 'Shows logs for the `foo` function in the production environment')
}

export async function handler (opts) {
  const envs = await load.envs()
  let questions

  if (envs && envs.length > 0) {
    questions = [
      {
        name: 'stage',
        message: 'Stage',
        type: 'list',
        choices: () => envs
      },
      {
        name: 'name',
        message: 'Function',
        type: 'list',
        choices: () => load.funcs()
      }
    ]
  } else {
    if (!opts.env) { console.log('no API found, cannot load available aliases') }

    questions = [
      {
        name: 'name',
        message: 'Function',
        type: 'list',
        choices: () => load.funcs()
      }
    ]
  }

  inquirer.prompt(questions.filter((q) => !opts[q.name]))
  .then((inputs) => merge({}, inputs, opts))
  .then(logs)
}
