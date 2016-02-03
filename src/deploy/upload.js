import Promise from 'bluebird'
import _ from 'lodash'
import * as lambda from '../util/lambda'
import fs from 'fs-extra-promise'
import path from 'path'
import { tmpdir } from 'os'
import exec  from '../util/exec'
import * as babel from 'babel-core'
import glob from '../util/glob'

const tmpDir = tmpdir()

export default function(funcDir, namespace, envConfig){
  const funcPackage = fs.readJsonSync(path.join(funcDir, 'package.json'))
  const rootPackage = fs.readJsonSync('package.json')
  const lambdaConfig = fs.readJsonSync(path.join(funcDir, 'lambda.json'))
  const packagedFuncDir = path.join(tmpDir, funcPackage.name)
  const zippedFunc = path.join(tmpDir, `${funcPackage.name}.zip`)
  const remoteFuncName = namespace + funcPackage.name

  return Promise.all([fs.removeAsync(packagedFuncDir), fs.removeAsync(zippedFunc)])
  .then(copyFunc)
  .then(writeConfig)
  .then(transpile)
  .then(inheritDeps)
  .then(installDeps)
  .then(zipDir)
  .then(upload)

  function copyFunc(){
    return fs.copyAsync(funcDir, packagedFuncDir, { dereference: true, filter: (path) => path.indexOf('node_modules') < 0 })
  }

  function transpile(){
    return glob(`${packagedFuncDir}/**/*.js`).map((path)=>{
      return fs.readFileAsync(path, 'utf8')
      .then((file) => {
        return babel.transform(file, { presets: ["es2015"] })
      })
      .get('code')
      .then((code) => {
        return fs.writeFileAsync(path, code)
      })
    })
  }

  function writeConfig(){
    return Promise.all([
      fs.removeAsync(path.join(packagedFuncDir, 'env.js')),
      fs.writeJSONAsync(path.join(packagedFuncDir, 'env.json'), envConfig)
    ])
  }


  function inheritDeps(){
    funcPackage.dependencies = _.assign(funcPackage.dependencies, rootPackage.dependencies)
    return fs.writeJSONAsync(path.join(funcDir, 'package.json'), funcPackage)
  }

  function installDeps(){
    return exec('npm install --silent --production', { cwd: packagedFuncDir })
  }

  function zipDir(){
    return exec(`zip -r ${zippedFunc} *`, { cwd: packagedFuncDir })
  }

  function upload(){

    return Promise.join(
      fs.readFileAsync(zippedFunc),
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
      params.Runtime = 'nodejs'

      return lambda.createFunc(params)
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
