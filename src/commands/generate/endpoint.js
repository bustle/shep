import inquirer from 'inquirer'
import generateEndpoint from '../../generate-endpoint'
import merge from 'lodash.merge'

const httpMethods = ['get', 'post', 'put', 'delete', 'options', 'any']

export const command = 'endpoint [path]'
export const desc = 'Generate a new API endpoint'
export function builder (yargs) {
  return yargs
  .pkgConf('shep', process.cwd())
  .describe('method', 'HTTP Method')
  .choices('method', httpMethods)
}

export function handler (opts) {
  inquirer.prompt([
    {
      name: 'path',
      type: 'input',
      message: 'Endpoint path',
      default: '/users/{id}',
      validate: (val) => val === '' ? 'Path cannot be blank' : true
    },
    {
      name: 'method',
      type: 'list',
      message: 'HTTP method',
      choices: httpMethods
    }
  ])
  .then((inputs) => merge({}, inputs, opts))
  .then(generateEndpoint)
}
