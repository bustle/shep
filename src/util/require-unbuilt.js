import { requireProject, projectPath } from './require-project'
import { readFile } from './modules/fs'
import { babelrc } from './load'

export default async function (functionPath) {
  const { transform } = requireProject('node_modules/babel-core')
  const absPath = projectPath(functionPath)
  const code = await readFile(absPath)
  const { code: transpiledCode } = transform(code, babelrc())
  return requireString(transpiledCode)
}

function requireString (src) {
  const m = new module.constructor()
  m.paths = module.paths
  m._compile(src)
  return m.exports
}
