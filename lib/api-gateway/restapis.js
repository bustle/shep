var config = require('../config');
var _ = require('lodash');
var request = require('./request');

var baseOpts = { service: 'apigateway', region: config.AWS_REGION };

module.exports.list = function(callback){
  var opts = _.merge(baseOpts, { method: 'GET', path: '/restapis'});
  return request(opts, callback);
};

module.exports.create = function(name, description, callback){
  var body = { name: name, description: description };
  var opts = _.merge(baseOpts, { method: 'POST', path: '/restapis', body: JSON.stringify(body)});
  return request(opts, callback);
};

module.exports.resources = function(id, callback){
  var opts = _.merge(baseOpts, { method: 'GET', path: '/restapis' + id + '/resources'});
  return request(opts, callback);
};

module.exports.models = function(id, callback){
  var opts = _.merge(baseOpts, { method: 'GET', path: '/restapis' + id + '/models'});
  return request(opts, callback);
};

module.exports.deployments = function(id, callback){
  var opts = _.merge(baseOpts, { method: 'GET', path: '/restapis' + id + '/deployments'});
  return request(opts, callback);
};

module.exports.stages = function(id, callback){
  var opts = _.merge(baseOpts, { method: 'GET', path: '/restapis' + id + '/stages'});
  return request(opts, callback);
};
