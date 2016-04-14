const { kebabCase } = require('lodash')

module.exports = function(flags){
  return [
    {
      name: 'api',
      message: 'Set to false if using shep just for lambda functions and not integrating with API gateway',
      when: () => false // Never promp the user for this
    },
    {
      name: 'apiName',
      message: 'API name',
      default: 'api.example.com',
      when: () => flags.api !== false
    },
    {
      name: 'folder',
      message: 'Project folder',
      default: (answers) => flags.apiName || answers.apiName
    },
    {
      name: 'functionNamespace',
      message: 'Lambda function namespace',
      default: (opts) => opts.apiName ? kebabCase(opts.apiName) : null,
      validate: (input) => /^[a-zA-Z0-9-_]+$/.test(input) ? true : 'Namespace must contain only letters, numbers, hyphens, or underscores'
    },
    {
      name: 'region',
      message: 'AWS region?',
      default: 'us-east-1'
    },
    {
      name: 'accountId',
      message: 'AWS Account ID. NOT your secret key or access key',
      validate: (input) => /^[0-9]+$/.test(input) ? true : 'AWS Account ID must contain only numbers',
      when: () => flags.api !== false
    }
  ]
}
