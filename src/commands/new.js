import _new from '../new'
import inquirer from 'inquirer'
import merge from 'lodash.merge'

const questions = [
  {
    type: 'input',
    name: 'path',
    message: 'Project folder name',
    default: 'my-api'
  }
]

export const command = 'new [path]'
export const desc = 'Create a new shep project'
export function builder (yargs) {
  return yargs
  .describe('path', 'Location to create the new shep project')
  .example('shep new', 'Launch an interactive CLI')
  .example('shep new my-api', 'Generates a project at `my-api`')
}

export function handler (opts) {
  inquirer.prompt(questions.filter((q) => !opts[q.name]))
  .then((inputs) => merge({}, inputs, opts))
  .then(_new)
}
