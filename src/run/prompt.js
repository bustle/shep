require('babel-register')

import prompt from '../util/prompt'
import glob from 'glob'
import index from './index'

export default function(flags){
  const funcs = glob.sync('functions/*').map((path) => path.split('/').pop())

  return prompt([
    {
      name: 'name',
      type: 'list',
      choices: funcs,
      message: 'Which lambda function?'
    }
  ])
  .then(index)
}
