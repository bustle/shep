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
