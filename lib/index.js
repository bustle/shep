const P = require('bluebird');
const jsonFile = require('./util/json-file');
const _ = require('lodash');
const AWS = require('aws-sdk');

var readConfig = _.partial(jsonFile.read, 'config.json', { default: {} });
var readEnv = _.partial(jsonFile.read, 'environment.json', { default: {} });

var validCommands = ['new', 'configure', 'deploy', 'generate', 'pull', 'push', 'help'];

module.exports = function(args){
  var command = args._[0];
  if (_.contains(validCommands, command)) {
    return P.all([readConfig(), readEnv()]).spread(function(config, env){
      AWS.config.update(env);
      return require('./' + command)(args, config);
    });
  } else {
    return P.reject(new Error('That command was not recognized'));
  }
};
