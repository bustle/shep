import prompt from '../util/prompt'
import index from './index'
import { assign } from 'lodash'

export default function(flags, config){
  return prompt([
    {
      name: 'path',
      message: 'Resource path?',
      default: '/users'
    }
  ])
  .then((answers) => index(assign({}, answers, flags), config))
}
