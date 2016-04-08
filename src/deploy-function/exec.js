const Promise = require('bluebird')
const _ = require('lodash')
const lambda = require('../util/lambda')
const fs = require('fs-extra-promise')
const path = require('path')
const { tmpdir } = require('os')
const exec  = require('../util/exec')
const babel = require('babel-core')
const glob = require('../util/glob')
const observatory = require('observatory')

const tmpDir = tmpdir()

module.exports = function(opts, api, pkg){
  const funcDir = `functions/${opts.name}`
  const funcPackage = fs.readJsonSync(`${funcDir}/package.json`)
  const rootPackage = fs.readJsonSync('package.json')
  const lambdaConfig = fs.readJsonSync(`${funcDir}/lambda.json`)
  const tmpFuncDir = path.join(tmpDir, opts.name)
  const tmpFuncZipFile = path.join(tmpDir, `${opts.name}.zip`)
  const remoteFuncName = namespace ? `${namespace}-${opts.name}` : name
  const task = observatory.add(`${remoteFuncName}`)

  return Promise.all([fs.removeAsync(tmpFuncDir), fs.removeAsync(tmpFuncZipFile)])
  .then(copyFunc)
  .then(writeConfig)
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
      .then((file) => {
        return babel.transform(file, babelConfig)
      })
      .get('code')
      .then((code) => {
        return fs.writeFileAsync(path, code)
      })
    })
  }

  function writeConfig(){
    task.status('Writing env variables')
    return Promise.all([
      fs.removeAsync(path.join(tmpFuncDir, 'env.js')),
      fs.writeJSONAsync(path.join(tmpFuncDir, 'env.json'), env)
    ])
  }


  function inheritDeps(){
    funcPackage.dependencies = _.assign(funcPackage.dependencies, rootPackage.dependencies)
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

      return lambda.createFunc(params).tap(()=> console.log(`Created ${remoteFuncName} on AWS`))
    }

    function get(){
      return lambda.getFunc({FunctionName: remoteFuncName})
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
      return lambda.updateFuncCode(params)
    }

    function updateConfig() {
      var params = _.clone(lambdaConfig)
      params.FunctionName = remoteFuncName
      return lambda.updateFuncConfig(params)
    }
  }
}
