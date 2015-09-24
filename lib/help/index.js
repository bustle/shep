const P = require('bluebird');

module.exports = function(){
  return P.reject('Some day this will print out help. Today is not that day.');
};
