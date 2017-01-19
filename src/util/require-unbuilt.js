import path from 'path'
import requireProject from './require-project'
import { readFile } from './modules/fs'
import { pkg } from './load'

// will need to load babel-core from local (i.e. curdir/node_modules/) packages
export default async function (functionPath) {
  const { transform } = requireProject('node_modules/babel-core')
  const absPath = path.join(process.cwd(), functionPath)
  const code = await readFile(absPath)
  const { code: transpiledCode } = transform(code, pkg().babel)
  return requireFromString(transpiledCode)
}

// shameless steal from stack overflow, hope to understand/refactor
function requireFromString (src, filename) {
  const m = new module.constructor()
  m.paths = module.paths
  m._compile(src, filename)
  return m.exports
}
