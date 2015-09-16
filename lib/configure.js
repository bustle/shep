const create = require('./create');
const _ = require('lodash');

module.exports = function(args){
  create.file('environment.js', _.pick(args, 'key', 'secret', 'region'));
};
