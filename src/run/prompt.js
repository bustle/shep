require('babel-register')

import prompt from '../util/prompt'
import glob from 'glob'
import index from './index'
import { assign } from 'lodash'

export default function(flags){
  const funcs = glob.sync('functions/*').map((path) => path.split('/').pop())

  return prompt([
    {
      name: 'name',
      type: 'list',
      choices: funcs,
      message: 'Which lambda function?',
      when: () => !flags.name
    }
  ])
  .then((answers) => assign({},flags,answers))
  .then(index)
}
