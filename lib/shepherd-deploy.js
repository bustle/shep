#! /usr/bin/env node

var program = require('commander');

require('./check-cwd')();

program
  .command('*')
  .description('deploys everything!')
  .action(deploy);

program.parse(process.argv);

function deploy(){
  console.log('Working on it!');
}
