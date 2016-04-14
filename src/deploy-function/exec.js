const Promise = require('bluebird')
const { clone, assign } = require('lodash')
const lambda = require('../util/lambda')
const fs = require('../util/fs')
const path = require('path')
const { tmpdir } = require('os')
const exec  = require('../util/exec')
const babel = require('babel-core')
const glob = require('../util/glob')
const observatory = require('observatory')
const archiver = require('archiver')
const streamBuffers = require('stream-buffers')

const tmpDir = tmpdir()

module.exports = function(opts, api, pkg){
  const funcDir = `functions/${opts.name}`
  const funcPackage = fs.readJsonSync(`${funcDir}/package.json`)
  const lambdaConfig = fs.readJsonSync(`${funcDir}/lambda.json`)
  const tmpFuncDir = path.join(tmpDir, opts.name)
  const tmpFuncZipFile = opts.output || path.join(tmpDir, `${opts.name}.zip`)
  const remoteFuncName = opts.functionNamespace ? `${opts.functionNamespace}-${opts.name}` : opts.name
  let task
  if (opts.slient !== true) { task = observatory.add(`Deploying ${remoteFuncName}`)}

  return Promise.all([fs.removeAsync(tmpFuncDir), fs.removeAsync(tmpFuncZipFile)])
  .then(copyFunc)
  .then(writeEnvVars)
  .then(transpile)
  .then(inheritDeps)
  .then(installDeps)
  .then(zipDir)
  .then(upload)

  function copyFunc(){
    if (task) { task.status('Copying Files') }
    return fs.copyAsync(funcDir, tmpFuncDir, { dereference: true, filter: (path) => path.indexOf('node_modules') < 0 })
  }

  function transpile(){
    if (task) { task.status('Transpiling ES2015') }
    return glob(`${tmpFuncDir}/**/*.js`).map((path)=>{
      return fs.readFileAsync(path, 'utf8')
      .then((file) => babel.transform(file, pkg.babel).code )
      .then((code) => fs.writeFileAsync(path, code))
    })
  }

  function writeEnvVars(){
    if (opts.env){
      if (task) { task.status('Writing env variables') }
      const handler = `${tmpFuncDir}/${lambdaConfig.Handler}`
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
    return fs.readJSONAsync(`config/${opts.env}.json`)
    .then((env)=>{
      return `global.env = ${JSON.stringify(env, null, 2)}`
    })
  }

  function inheritDeps(){
    funcPackage.dependencies = assign(funcPackage.dependencies, pkg.dependencies)
    return fs.writeJSONAsync(path.join(tmpFuncDir, 'package.json'), funcPackage)
  }

  function installDeps(){
    if (task) { task.status('Installing dependencies') }
    return exec('npm install --silent --production', { cwd: tmpFuncDir })
  }

  function zipDir(){
    return new Promise((resolve, reject)=>{
      if (task) { task.status('Zipping function') }
      const archive = archiver.create('zip')
      let output
      if (opts.output){
        output = fs.createWriteStream(tmpFuncZipFile)
      } else {
        output = new streamBuffers.WritableStreamBuffer()
      }

      output.on('finish', function() { resolve(output) })
      archive.on('error', function(err) { reject(err) })
      archive.pipe(output)
      archive.directory(tmpFuncDir, './').finalize()
    })
  }

  function upload(stream){
    if (opts.output){
      task.done(`Zip written to ${tmpFuncZipFile}`)
      return Promise.resolve()
    } else {
      if (task) { task.status('Uploading to AWS') }
      return Promise.join(
        stream.getContents(),
        get(),
        (zipFile, remoteFunc)=> {
          if (remoteFunc){
            return Promise.all([updateCode(zipFile), updateConfig()]).get(0)
          } else {
            return create(zipFile)
          }
        }
      ).tap(() => { if (task) { task.done('Complete!') }})
    }

    function create(ZipFile) {
      var params = clone(lambdaConfig)

      params.Code = { ZipFile }
      params.FunctionName = remoteFuncName

      return lambda.createFunction(params)
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
      var params = clone(lambdaConfig)
      params.FunctionName = remoteFuncName
      return lambda.updateFunctionConfiguration(params)
    }
  }
}
