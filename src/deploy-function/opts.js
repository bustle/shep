const loadEnvs = require('../util/load-envs')
const glob = require('glob')

module.exports = function(){

  const funcs = glob.sync('functions/*')
  .map((path) => path.split('/').pop())

  const envs = loadEnvs()

  return [
    {
      name: 'name',
      type: 'list',
      choices: funcs,
      message: 'Which function?'
    },
    {
      name: 'env',
      type: 'list',
      choices: envs,
      message: 'Which environment variables?'
    }
  ]
}
