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
      message: 'Function name'
    },
    {
      name: 'env',
      type: 'list',
      choices: envs,
      message: 'Environment'
    },
    {
      name: 'output',
      message: 'Output path. Setting this will not upload function to AWS',
      when: () => false
    }
  ]
}
