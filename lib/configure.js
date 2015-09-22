const jsonFile = require('./json-file');
const _ = require('lodash');

module.exports = function(args){
  return jsonFile.write('environment.json', _.pick(args, 'key', 'secret', 'region'));
};
