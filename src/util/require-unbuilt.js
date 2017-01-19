import path from 'path'
import requireProject from './require-project'
import { readFile } from './modules/fs'
import { pkg } from './load'

export default async function (functionPath) {
  const { transform } = requireProject('node_modules/babel-core')
  const absPath = path.join(process.cwd(), functionPath)
  const code = await readFile(absPath)
  const { code: transpiledCode } = transform(code, pkg().babel)
  return requireString(transpiledCode)
}

function requireString (src) {
  const m = new module.constructor()
  m.paths = module.paths
  m._compile(src)
  return m.exports
}
