import prompt from '../util/prompt'
import glob from 'glob'
import { assign } from 'lodash'
import index from './index'

export default function(flags, config){
  const funcs = glob.sync('functions/*').map((path) => path.split('/').pop())
  const resources = config.resources.reduce((obj, resource) => {
    obj[resource.path] = resource.id
    return obj
  }, {})

  return prompt([
    {
      name: 'resourceId',
      type: 'list',
      choices: Object.keys(resources).sort(),
      message: 'Which resource?',
      filter: (input) => resources[input]
    },
    {
      name: 'httpMethod',
      type: 'list',
      choices: ['GET', 'POST', 'PUT', 'DELETE'],
      message: 'Which HTTP Method?'
    },
    {
      name: 'statusCode',
      default: '200',
      message: 'Default Status Code'
    },
    {
      name: 'contentType',
      default: 'application/json',
      message: 'Default content type'
    },
    {
      name: 'funcName',
      type: 'list',
      choices: funcs,
      message: 'Which lambda function?'
    }
  ])
  .then((answers) => index(assign({}, answers, flags), config))
}
