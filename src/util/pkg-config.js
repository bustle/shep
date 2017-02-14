import { writeJSON } from '../modules/fs'
import * as load from './load'

export function update (obj) {
  let pkg = load.pkg()
  if (!pkg.shep) { pkg.shep = {} }
  Object.keys(obj).forEach((key) => { pkg.shep[key] = obj[key] })
  return writeJSON('package.json', pkg, { spaces: 2 })
}
