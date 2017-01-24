import path from 'path'

export function requireProject (relativePath) {
  return require(projectPath(relativePath))
}

export function projectPath (relativePath) {
  return path.join(process.cwd(), relativePath)
}
