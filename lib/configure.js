const create = require('./create');
const _ = require('lodash');

module.exports = function(args){
  create.file({
    path: 'environment.js',
    content: 'module.exports = ' + JSON.stringify(_.pick(args, 'key', 'secret', 'region'), null, 2) +';'
  });
};
