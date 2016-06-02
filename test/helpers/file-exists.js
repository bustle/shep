import fs from 'fs-extra-promise'

export default function fileExists(path){
  return fs.statAsync(path).then((stat) => stat.isFile())
}
