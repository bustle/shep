import { tmpdir } from 'os'
import { promisify } from 'bluebird'
import { access, F_OK } from 'fs-extra'
import exec from '../src/util/exec'
import newProject from '../src/new'

const tmpDir = tmpdir()
const accessPromise = promisify(access)
const origCwd = process.cwd()

export function setup(){
  process.chdir(tmpDir)
  return newProject({api: false, folder: 'test-api', functionNamespace: 'test-namespace'})
}

export function clean(){
  return exec('rm -rf ./test-api')
  .then(() => process.chdir(origCwd))
}

export function exists(path){
  return accessPromise(path, F_OK)
}
