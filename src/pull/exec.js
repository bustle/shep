const fs = require('../util/fs')
const apiGateway = require('../util/api-gateway')

module.exports = function(opts = {}){
  return apiGateway.getResources({ restApiId: opts.apiId})
  .get('items')
  .then((api)=>{
    return fs.writeJsonAsync('api.json', api , { spaces: 2 })
  })
}
