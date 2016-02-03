import Promise from 'bluebird'
import prompt from '../util/prompt'
import _ from 'lodash'
import fs from 'fs-extra-promise'
import AWS from 'aws-sdk'
import exec from '../util/exec'

export default function (){

  return prompt([
    {
      name: 'name',
      message: 'API name?',
      default: 'api.example.com'
    },
    {
      name: 'folder',
      message: 'Project folder?',
      default: (answers) => answers.name
    },
    {
      name: 'namespace',
      message: 'Lambda function namespace?',
      default: (answers) => _.kebabCase(answers.name) + "-"
    },
    {
      name: 'region',
      message: 'AWS region?',
      default: 'us-east-1'
    },
    {
      name: 'accountId',
      message: 'AWS Account ID? NOT your secret key or access key',
    }
  ])
  .then(createProjectFolder)
  .then(createApi)
  .then(createDirectories)
  .then(createFiles)
  .then(execPull)

  function execPull(params){
    return exec('shepherd pull', { cwd: params.folder })
  }

  function createApi(params){
    AWS.config.update({region: params.region })
    const apiGateway = new AWS.APIGateway()
    console.log('Creating API on AWS...')

    return (new Promise((resolve, reject) => {
        apiGateway.createRestApi({name: params.name}, (err, res)=>{
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    )
    .then(({ id })=>{
      return _.assign(params, { id })
    })
  }

  function createProjectFolder(params){
    console.log('Creating Project Folder...')
    return fs.mkdirAsync(params.folder)
    .return(params)
  }

  function createDirectories(params){
    return fs.mkdirAsync(params.folder + '/functions')
    .return(params)
  }

  function createFiles(params){
    return Promise.all([
      fs.writeJSONAsync(params.folder + '/api.json', { name: params.name, region: params.region, id: params.id, functionNamespace: params.namespace, accountId: params.accountId }),
      fs.writeJSONAsync(params.folder + '/package.json', { name: params.name, devDependencies: { 'babel-preset-es2015': "^6.3.13" }, babel: { "presets": ["es2015"] } }),
      fs.writeFileAsync(params.folder + '/env.js.example', "module.exports = { beta: { env: 'beta', secret: 'beta-key' }, production: { env: 'production', secret: 'prod-key'} }"),
      fs.writeFileAsync(params.folder + '/.gitignore', 'node_modules/*\nenv.js'),
      fs.writeFileAsync(params.folder + '/README.md', `#${params.name}`),
      fs.writeJSONAsync(params.folder + '/.jshintrc', {
        "node": true,
        "esnext": true,
        "eqeqeq": true,
        "indent": 2,
        "latedef": "nofunc",
        "newcap": true,
        "undef": true,
        "unused": true,
        "mocha": true,
        "asi": true,
        "predef": [ "-Promise" ]
      })
    ])
    .return(params)
  }
}
