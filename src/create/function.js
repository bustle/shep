import Promise from 'bluebird'
import prompt from '../util/prompt'
import fs from 'fs-extra-promise'
import upload from '../deploy/upload'

export default function(config){
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
  .then(createDir)
  .then(createFiles)
  .then(createOnAWS)

  function createOnAWS(params){
    return upload(`functions/${params.name}`, config.functionNamespace)
  }

  function createDir(params){
    return fs.mkdirAsync(`functions/${params.name}`).return(params)
  }

  function createFiles(params){
    return Promise.all([
      createIndexJS(params),
      createPackageJSON(params),
      createGitIgnore(params),
      createLambdaConfig(params),
      createEventJSON(params),
      createConfig(params)
    ]).return(params)
  }

  function createIndexJS(params){
    const content = `
import env from './env'

export function handler({ headers, pathParameters, queryParameters, body }, context) {
  // Replace below with your own code!
  context.succeed({ headers, pathParameters, queryParameters, body, env })
}`
    return fs.writeFileAsync(`functions/${params.name}/index.js`, content)
  }

  function createPackageJSON(params){
    const content = {
      name: params.name,
      version: '0.0.1',
      description: '',
      main: 'index.js',
      scripts: {
        'test': 'echo \"Error: no test specified\" && exit 1'
      },
      author: '',
      dependencies: {}
    }
    return fs.writeJSONAsync(`functions/${params.name}/package.json`, content)
  }

  function createGitIgnore(params){
    const content = `node_modules/*`
    return fs.writeFileAsync(`functions/${params.name}/.gitignore`, content)
  }

  function createEventJSON(params){
    const content = { key: 'value' }
    return fs.writeJSONAsync(`functions/${params.name}/event.json`, content)
  }

  function createConfig(params){
    const content = `
import { development } from '../../env'
export default development`
    return fs.writeFileAsync(`functions/${params.name}/env.js`, content)
  }

  function createLambdaConfig(params){
    const content = {
      Handler: 'index.handler',
      MemorySize: 128,
      Role: params.role,
      Timeout: 3
    }
    return fs.writeJSONAsync(`functions/${params.name}/lambda.json`, content)
  }
}
