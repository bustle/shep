import * as shep from '../../src'
import path from 'path'

export function create(name){
  const p = path.join(__dirname, `../../tmp/tests/${name}`)
  return shep.new({ path: p }).then(() => process.chdir(p) ).return(p)
}
