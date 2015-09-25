const request = require('./request');
const log = require('../util/log');
const _ = require('lodash');
const P = require('bluebird');

module.exports.list = function(){
  return request({ method: 'GET', path: '/restapis'});
};

module.exports.create = function(name, description){
  var body = { name: name, description: description };
  return request({ method: 'POST', path: '/restapis', body: JSON.stringify(body)})
    .tap(function(response){
      log.success('created new api:', response.name);
    });
};

module.exports.resources = function(id){
  return request({ method: 'GET', path: '/restapis/' + id + '/resources'}).
    then(normalizeResponse);
};

module.exports.models = function(id){
  return request({ method: 'GET', path: '/restapis/' + id + '/models'}).
    then(normalizeResponse);
};

module.exports.deployments = function(id){
  return request({ method: 'GET', path: '/restapis/' + id + '/deployments'});
};

module.exports.stages = function(id){
  return request({ method: 'GET', path: '/restapis/' + id + '/stages'});
};

function filterKeys(obj){
  return _.pick(obj, function(value, key) {
    return !_.startsWith(key, '_');
  });
}

function makeArray(obj){
  if (_.isArray(obj)) { return obj; }
  return [obj];
}

function normalizeResponse(resp){
  return P.resolve(resp._embedded.item).
    then(makeArray).
    map(filterKeys);
}
