const P = require('bluebird');
const _ = require('lodash');

var validCommands = ['function', 'resource'];

module.exports = function(args, config){
  var command = args._[1];
  if (_.contains(validCommands, command)) {
    return require('./' + command)(args, config);
  } else {
    return P.reject(new Error('That command was not recognized'));
  }
};
