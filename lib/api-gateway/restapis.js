const path = require('path');
const config = require(path.resolve('./config'));
const _ = require('lodash');
const request = require('./request');
const chalk = require('chalk');

const baseOpts = { service: 'apigateway', region: config.region };

module.exports.list = function(){
  var opts = _.merge({ method: 'GET', path: '/restapis'}, baseOpts);
  return request(opts);
};

module.exports.create = function(name, description){
  var body = { name: name, description: description };
  var opts = _.merge({ method: 'POST', path: '/restapis', body: JSON.stringify(body)}, baseOpts);
  return request(opts).tap(function(response){
    console.log(chalk.green('✔'),'created new api:', response.name);
  });
};

module.exports.resources = function(id){
  var opts = _.merge({ method: 'GET', path: '/restapis/' + id + '/resources'}, baseOpts);
  return request(opts);
};

module.exports.models = function(id){
  var opts = _.merge({ method: 'GET', path: '/restapis/' + id + '/models'}, baseOpts);
  return request(opts);
};

module.exports.deployments = function(id){
  var opts = _.merge({ method: 'GET', path: '/restapis/' + id + '/deployments'}, baseOpts);
  return request(opts);
};

module.exports.stages = function(id){
  var opts = _.merge({ method: 'GET', path: '/restapis/' + id + '/stages'}, baseOpts);
  return request(opts);
};
