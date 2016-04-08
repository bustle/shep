const path = require('path')
const glob = require('glob')

module.exports = function(){

  const funcs = glob.sync('functions/*').map((path) => path.split('/').pop())
  const envs = require(path.join(process.cwd(),'env.js'))

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
      choices: Object.keys(envs),
      message: 'Which environment variables?'
    }
  ]
}
