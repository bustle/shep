#! /usr/bin/env node

var program = require('commander');
var fs = require('fs');

// try {
//   var configFile = fs.statSync('./shepherd-config.js')
// } catch (e) {
//   console.log(chalk.red('No shepherd-config.js file present. Did you mean to run this command from the project root?'))
//   process.exit(1)
// }

program
  .command('*')
  .description('deploy everything!')
  .action(deploy);


program.parse(process.argv);

function deploy(){
  console.log('Working on it!')
}
