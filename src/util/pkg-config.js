import { writeJSON } from './modules/fs'
import * as load from './load'

export async function update (obj) {
  let pkg = await load.pkg()
  if (!pkg.shep) { pkg.shep = {} }
  Object.keys(obj).forEach((key) => { pkg.shep[key] = obj[key] })
  return writeJSON('package.json', pkg, { spaces: 2 })
}
