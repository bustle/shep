const P = require('bluebird');
const _ = require('lodash');

module.exports = function(args){
  console.log(args)
  var fullPath = args._[2];
  var paths = fullPath.split('/').
    map(function(segment, index, array){
      return _.take(array, index + 1).join('/');
    });
  paths[0] = '/';
  console.log(paths);
  return P.resolve(paths);
};
