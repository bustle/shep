var fs = require('fs');
var log = require('./log');
var path = require('path');

module.exports = function(){
  try {
    fs.statSync(path.resolve(process.cwd() + '/config.json'));
  } catch (e) {
    log.failure('No config.json file present. Did you mean to run this command from the project root?');
    process.exit(1);
  }
};
