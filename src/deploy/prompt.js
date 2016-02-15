import prompt from '../util/prompt'
import index from './index'
import { assign } from 'lodash'
import path from 'path'
import glob from 'glob'

export default function(flags, config){

  const envs = require(path.join(process.cwd(),'env.js'))

  return prompt([
    {
      name: 'env',
      type: 'list',
      choices: Object.keys(envs),
      message: 'Which environment?'
    }
  ])

  .then((answers) => assign({},flags,answers))
  .then((opts) => index({namespace: config.functionNamespace, env: envs[opts.env], envName: opts.env }, config))
}
