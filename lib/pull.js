var restapis = require('./api-gateway/restapis');
var jsonFile = require('./json-file');
var P = require('bluebird');

var pull = function(id){
  return P.all([
    pull.resources(id),
    pull.models(id)
  ]);
};

pull.resources = function(id){
  return restapis.resources(id).
    then(function(resource){
      jsonFile.write('resources/root.json', resource);
    });
};

pull.models = function(id){
  return restapis.models(id).
    map(function(model){
      jsonFile.write('models/' + model.name + '.json', model);
    });
};

module.exports = pull;
