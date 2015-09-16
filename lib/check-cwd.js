var fs = require('fs');
var chalk = require('chalk');
var path = require('path');

module.exports = function(){
  try {
    fs.statSync(path.resolve(process.cwd() + '/config.js'));
  } catch (e) {
    console.log(chalk.red('No config.js file present. Did you mean to run this command from the project root?'));
    process.exit(1);
  }
};
