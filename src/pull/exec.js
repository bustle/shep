const fs = require('../util/fs')

module.exports = function(opts = {}){

  const apiGateway = require('../util/api-gateway')

  return apiGateway.getResources(opts.apiId)
  .get('items')
  .then((api)=>{
    return fs.writeJsonAsync('api.json', api , { spaces: 2 })
  })
}
