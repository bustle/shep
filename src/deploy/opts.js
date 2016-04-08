const loadEnvs = require('../util/load-envs')

module.exports = function(){
  const envs = loadEnvs()

  return [
    {
      name: 'env',
      type: 'list',
      choices: envs,
      message: 'Which environment?'
    }
  ]
}
