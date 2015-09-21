const create = require('../create');

module.exports = function(name){
  return create.dir('./resources/' + name);
};
