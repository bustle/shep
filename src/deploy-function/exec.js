const Promise = require('bluebird')
const _ = require('lodash')
const lambda = require('../util/lambda')
const fs = require('../util/fs')
const path = require('path')
const { tmpdir } = require('os')
const exec  = require('../util/exec')
const babel = require('babel-core')
const glob = require('../util/glob')
const observatory = require('observatory')
const dotEnv = require('dotEnv')

const tmpDir = tmpdir()

module.exports = function(opts, api, pkg){
  const funcDir = `functions/${opts.name}`
  const funcPackage = fs.readJsonSync(`${funcDir}/package.json`)
  const lambdaConfig = fs.readJsonSync(`${funcDir}/lambda.json`)
  const tmpFuncDir = path.join(tmpDir, opts.name)
  const tmpFuncZipFile = path.join(tmpDir, `${opts.name}.zip`)
  const remoteFuncName = opts.functionNamespace ? `${opts.functionNamespace}-${opts.name}` : opts.name
  const task = observatory.add(`${remoteFuncName}`)

  console.log(tmpFuncDir)

  return Promise.all([fs.removeAsync(tmpFuncDir), fs.removeAsync(tmpFuncZipFile)])
  .then(copyFunc)
  .then(writeEnvVars)
  .then(transpile)
  .then(inheritDeps)
  .then(installDeps)
  .then(zipDir)
  .then(upload)
  .tap(()=> { task.done('Deployed!') })

  function copyFunc(){
    task.status('Copying Files')
    return fs.copyAsync(funcDir, tmpFuncDir, { dereference: true, filter: (path) => path.indexOf('node_modules') < 0 })
  }

  function transpile(){
    task.status('Transpiling ES2015')
    return glob(`${tmpFuncDir}/**/*.js`).map((path)=>{
      return fs.readFileAsync(path, 'utf8')
      .then((file) => babel.transform(file, pkg.babel).code )
      .then((code) => fs.writeFileAsync(path, code))
    })
  }

  function writeEnvVars(){
    if (opts.env){
      task.status('Writing env variables')
      const handler = `${tmpFuncDir}/${lambdaConfig.Handler}`
      console.log(lambdaConfig)
      const handlerFileName = handler.substring(0, handler.lastIndexOf('.')) + '.js'
      return Promise.join(
        fs.readFileAsync(handlerFileName, 'utf8'),
        readEnvFile(),
        (handlerFile, envHeader) => {
          return envHeader + '\n' + handlerFile
        }
      ).
      then((file)=>{
        return fs.writeFileAsync(handlerFileName, file)
      })
    } else {
      return Promise.resolve()
    }
  }

  function readEnvFile(){
    return fs.readFileAsync(`config/${opts.env}.env`)
    .then(dotEnv.parse)
    .then((env)=>{
      return `__env = ${JSON.stringify(env, null, 2)}
Object.keys(__env).forEach(function (key) {
  process.env[key] = process.env[key] || __env[key]
})
`
    })
  }

  function inheritDeps(){
    funcPackage.dependencies = _.assign(funcPackage.dependencies, pkg.dependencies)
    return fs.writeJSONAsync(path.join(tmpFuncDir, 'package.json'), funcPackage)
  }

  function installDeps(){
    task.status('Installing dependencies')
    return exec('npm install --silent --production', { cwd: tmpFuncDir })
  }

  function zipDir(){
    task.status('Zipping function')
    return exec(`zip -q -r ${tmpFuncZipFile} *`, { cwd: tmpFuncDir })
  }

  function upload(){
    task.status('Uploading zip to AWS')
    return Promise.join(
      fs.readFileAsync(tmpFuncZipFile),
      get(),
      (zipFile, remoteFunc)=> {
        if (remoteFunc){
          return Promise.all([updateCode(zipFile), updateConfig()]).get(0)
        } else {
          return create(zipFile)
        }
      }
    )

    function create(ZipFile) {
      var params = _.clone(lambdaConfig)

      params.Code = { ZipFile }
      params.FunctionName = remoteFuncName
      params.Runtime = 'nodejs4.3'

      return lambda.createFunction(params).tap(()=> console.log(`Created ${remoteFuncName} on AWS`))
    }

    function get(){
      return lambda.getFunction({FunctionName: remoteFuncName})
      .catch((err)=> {
        if (err.code === 'ResourceNotFoundException'){
          return Promise.resolve()
        } else {
          return Promise.reject(err)
        }
      })
    }


    function updateCode(ZipFile) {
      var params = { ZipFile, FunctionName: remoteFuncName }
      return lambda.updateFunctionCode(params)
    }

    function updateConfig() {
      var params = _.clone(lambdaConfig)
      params.FunctionName = remoteFuncName
      return lambda.updateFunctionConfiguration(params)
    }
  }
}
