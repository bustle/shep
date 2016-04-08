const loadFuncs = require('../util/load-funcs')

module.exports = function(){
  const funcs = loadFuncs()

  return [
    {
      name: 'name',
      type: 'list',
      choices: funcs,
      message: 'Which lambda function?'
    }
  ]
}
