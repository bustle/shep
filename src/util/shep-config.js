const fs = require('./fs')
const { forEach, set } = require('lodash')
const path = require('path')

module.exports.load = function(){
  let pkg = fs.readJSONSync(path.join( process.cwd(), 'package.json'))
  return pkg.shep || {}
}

module.exports.update = function(obj){
  let pkg = fs.readJSONSync(path.join( process.cwd(), 'package.json'))
  forEach(obj, (val, key) => set(pkg, `shep.${key}`, val))
  return fs.writeJSONAsync(path.join( process.cwd(), 'package.json'), pkg)
}
