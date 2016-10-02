import path from 'path'

export default function(projectPath){
  return require(path.join(process.cwd(), projectPath))
}
