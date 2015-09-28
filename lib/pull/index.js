var restapis = require('../api-gateway/restapis');
var jsonFile = require('../util/json-file');
var createResource = require('../generate/resource/create');
var P = require('bluebird');
var _ = require('lodash');

var pull = function(args, config){
  var id = config.id;
  return P.all([
    pull.resources(id),
    pull.models(id)
  ]);
};

pull.resources = function(id){
  return restapis.resources(id).
    map(createResource);
};

pull.models = function(id){
  return restapis.models(id).
    map(function(model){
      jsonFile.write('models/' + _.kebabCase(model.name) + '.json', model);
    });
};

module.exports = pull;
