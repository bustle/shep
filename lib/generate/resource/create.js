const jsonFile = require('../../util/json-file');
const _ = require('lodash');

module.exports = function(resource){
  jsonFile.write('resources/' + toFilename(resource.path) + '.json', resource);
};

function toFilename(str){
  if (str === '/') {
    return 'root';
  } else {
    return _.kebabCase(str);
  }
}
