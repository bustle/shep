import * as shep from '../../src'
import path from 'path'
import fs from 'fs-extra-promise'

export function create(name){
  const p = path.join(__dirname, `../../tmp/tests/${name}`)
  fs.removeSync(p)
  return shep.new({ path: p }).then(() => process.chdir(p) ).return(p)
}
