var restapis = require('../api-gateway/restapis');
var jsonFile = require('../util/json-file');
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
    map(function(resource){
      jsonFile.write('resources/' + toFilename(resource.path) + '.json', resource);
    });
};

pull.models = function(id){
  return restapis.models(id).
    map(function(model){
      jsonFile.write('models/' + toFilename(model.name) + '.json', model);
    });
};

function toFilename(str){
  if (str === '/') {
    return 'root';
  } else {
    return _.kebabCase(str);
  }
}

module.exports = pull;
