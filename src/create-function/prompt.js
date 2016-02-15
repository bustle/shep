import prompt from '../util/prompt'
import index from './index'
import { assign } from 'lodash'

export default function(flags, config){
  return prompt([
    {
      name: 'name',
      message: 'Function name?',
      validate: (input) => /^[a-zA-Z0-9-_]+$/.test(input) ? true : 'Function name must contain only letters, numbers, hyphens, or underscores'
    },
    {
      name: 'role',
      message: 'Lambda execution role. This must already exist. See your IAM console for details'
    }
  ])
  .then((answers) => assign({},flags,answers))
  .then((opts) => index(opts, config))
}
