import prompt from '../util/prompt'
import { kebabCase, assign } from 'lodash'
import index from './index'

export default function(flags){
  return prompt([
    {
      name: 'apiName',
      message: 'API name?',
      default: 'api.example.com',
      when: () => flags.api !== false
    },
    {
      name: 'folder',
      message: 'Project folder?',
      default: (answers) => answers.apiName
    },
    {
      name: 'functionNamespace',
      message: 'Lambda function namespace?',
      default: (answers) => answers.apiName ? kebabCase(answers.apiName) : null,
      validate: (input) => /^[a-zA-Z0-9-_]+$/.test(input) ? true : 'Namespace must contain only letters, numbers, hyphens, or underscores'
    },
    {
      name: 'region',
      message: 'AWS region?',
      default: 'us-east-1'
    },
    {
      name: 'accountId',
      message: 'AWS Account ID? NOT your secret key or access key',
      validate: (input) => /^[0-9]+$/.test(input) ? true : 'AWS Account ID must contain only numbers',
      when: () => flags.api !== false

    }
  ])
  .then((answers) => assign({},flags,answers))
  .then(index)
}
