import inquirer from 'inquirer'
import run from '../run'
import loadFuncs from '../util/load-funcs'
import { merge } from 'lodash'

export const command = 'run [name]'
export const desc = 'Run a function in your local environemnt'
export function builder (yargs){
  return yargs
  .pkgConf('shep', process.cwd())
  .describe('environment', 'Environment variables to use')
  .default('environment', 'development')
  .alias('environment', 'e')
  .example('shep run', 'Launch an interactive CLI')
  .example('shep run foo', 'Runs the `foo` function')
  .example('shep run foo -e production', 'Runs the `foo` function with production environment')
}

export function handler(opts) {
  const questions = [
    {
      name: 'name',
      message: 'Function',
      type: 'list',
      choices: () => loadFuncs()
    }
  ]

  inquirer.prompt(questions.filter((q)=> !opts[q.name] ))
  .then((inputs) => merge({}, inputs, opts) )
  .then(run)
}
