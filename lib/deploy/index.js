const restapis = require('../api-gateway/restapis');
const P = require('bluebird');
const jsonFile = require('./json-file');
const pull = require('./pull');

module.exports = function(){
  return jsonFile.read('config.json').then(function(config){
    if (config.id){
      return P.reject('This API already has an ID on AWS. Not going to create another one');
    } else {
      return restapis.create(config.name, config.description).
        then(responseHandler);
    }

    function responseHandler(resp){
     return P.all([
       writeId(resp.id),
       pull(resp.id)
     ]);
    }

    function writeId(id){
      return jsonFile.write('config.json', {id: id});
    }
  });
};
