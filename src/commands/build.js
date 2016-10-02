import inquirer from 'inquirer'
import build from '../build'
import loadEnvs from '../util/load-envs'
import merge from 'lodash.merge'

export const command = 'build [env] [functions]'
export const desc = 'Builds functions and writes them to disk'
export function builder (yargs){
  return yargs
  .example('shep build', 'Launch an interactive CLI')
  .example('shep build beta', 'Build all functions with beta environment variables')
  .example('shep build beta create-user', 'Build only the create-user function')
  .example('shep build beta *-user', 'Build functions matching the pattern *-user')
}

export function handler(opts) {
  const questions = [
    {
      name: 'env',
      message: 'Environment',
      type: 'list',
      choices: () => loadEnvs()
    }
  ]

  inquirer.prompt(questions.filter((q)=> !opts[q.name] ))
  .then((inputs) => merge({}, inputs, opts) )
  .then(build)
}
