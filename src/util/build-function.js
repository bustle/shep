import webpack from 'webpack'
import Promise from 'bluebird'
import fs from 'fs-extra-promise'
import requireProject from '../util/require-project'

import { update } from './tasks'

const wp = Promise.promisify(webpack)

export default function(name, env){
  const config = requireProject('./webpack.config.js')

  return Promise.try(() => update(name, 'Cleaning files'))
  .then(() => fs.removeAsync(`dist/${name}`)  )
  .then(() => update(name, 'Running Webpack'))
  .then(() => wp(config(name,env)) )
  .then((stats) => {

    // TODO Handle errors from webpack better
    
    const jsonStats = stats.toJson()
    if(jsonStats.errors.length > 0) console.log(jsonStats.errors)
    // if(jsonStats.warnings.length > 0) jsonStats.warnings.map(console.log); throw new Error('Webpack Warnings!')
  })
}
