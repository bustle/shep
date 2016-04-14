const loadFuncs = require('../util/load-funcs')

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE']

module.exports = function(flags, api){
  const funcs = loadFuncs()
  const resourcePaths = api.map((resource) => resource.path)

  return [
    {
      name: 'resourceId',
      message: 'Resource ID',
      when: false
    },
    {
      name: 'resourcePath',
      type: 'list',
      choices: resourcePaths,
      message: 'Resource path'
    },
    {
      name: 'httpMethod',
      type: 'list',
      choices: httpMethods,
      message: 'HTTP Method',
      validate: (input) => httpMethods.indexOf(input)
    },
    {
      name: 'statusCode',
      default: '200',
      message: 'Default status code'
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
      message: 'Function name'
    }
  ]
}
