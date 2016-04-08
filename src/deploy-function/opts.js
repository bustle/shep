const loadEnvs = require('../util/load-envs')
const loadFuncs = require('../util/load-funcs')

module.exports = function(){

  const funcs = loadFuncs()
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
