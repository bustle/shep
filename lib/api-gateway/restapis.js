const path = require('path');
const config = require(path.resolve('./config'));
const _ = require('lodash');
const request = require('./request');

const baseOpts = { service: 'apigateway', region: config.AWS_REGION };

module.exports.list = function(callback){
  var opts = _.merge({ method: 'GET', path: '/restapis'}, baseOpts);
  return request(opts, callback);
};

module.exports.create = function(name, description, callback){
  var body = { name: name, description: description };
  var opts = _.merge({ method: 'POST', path: '/restapis', body: JSON.stringify(body)}, baseOpts);
  return request(opts, callback);
};

module.exports.resources = function(id, callback){
  var opts = _.merge({ method: 'GET', path: '/restapis' + id + '/resources'}, baseOpts);
  return request(opts, callback);
};

module.exports.models = function(id, callback){
  var opts = _.merge({ method: 'GET', path: '/restapis' + id + '/models'}, baseOpts);
  return request(opts, callback);
};

module.exports.deployments = function(id, callback){
  var opts = _.merge({ method: 'GET', path: '/restapis' + id + '/deployments'}, baseOpts);
  return request(opts, callback);
};

module.exports.stages = function(id, callback){
  var opts = _.merge({ method: 'GET', path: '/restapis' + id + '/stages'}, baseOpts);
  return request(opts, callback);
};
