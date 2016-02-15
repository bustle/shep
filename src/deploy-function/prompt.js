import prompt from '../util/prompt'
import index from './index'
import { assign } from 'lodash'
import path from 'path'
import glob from 'glob'

export default function(flags, config){

  const funcs = glob.sync('functions/*').map((path) => path.split('/').pop())
  const envs = require(path.join(process.cwd(),'env.js'))

  return prompt([
    {
      name: 'name',
      type: 'list',
      choices: funcs,
      message: 'Which function?'
    },
    {
      name: 'env',
      type: 'list',
      choices: Object.keys(envs),
      message: 'Which environment variables?'
    }
  ])

  .then((answers) => assign({},flags,answers))
  .then((opts) => index({name: opts.name, namespace: config.functionNamespace, env: envs[opts.env] }))
}
