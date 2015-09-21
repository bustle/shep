const create = require('./create');
const _ = require('lodash');

module.exports = function(args){
  return create.file('environment.js', _.pick(args, 'key', 'secret', 'region'));
};
