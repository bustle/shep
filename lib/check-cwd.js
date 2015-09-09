var fs = require('fs');
var chalk = require('chalk');

module.exports = function(){
  try {
    fs.statSync('./shepherd-config.js');
  } catch (e) {
    console.log(chalk.red('No shepherd-config.js file present. Did you mean to run this command from the project root?'));
    process.exit(1);
  }
};
