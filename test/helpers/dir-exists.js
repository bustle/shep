import fs from 'fs-extra-promise'

export default function dirExists(path){
  return fs.statAsync(path).then((stat) => stat.isDirectory())
}
