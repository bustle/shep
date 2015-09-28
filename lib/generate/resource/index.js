const P = require('bluebird');
const _ = require('lodash');
const createResource = require('./create');

module.exports = function(args){
  var fullPath = args._[2];
  var paths = fullPath.split('/').
    map(function(segment, index, array){
      var path = _.take(array, index + 1).join('/');
      return { path: path, pathPart: segment};
    });
  paths[0].pathPart = '/';
  paths[0].path = '/';
  return P.resolve(paths).each(createResource);
};
