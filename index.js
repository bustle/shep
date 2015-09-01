#! /usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')

program
  .command('new <folder_name>')
  .description('Generate a new project folder')
  .action(wip);

program
  .command('generate <api_name>')
  .description('Generate a new API endpoint, Lambda function, and test')
  .action(wip);

program
  .command('test [api_name]')
  .description('Run tests. Optionally name a specific test to run')
  .action(wip);

program
  .command('deploy [env]')
  .description('Deploy all new/updated functions/APIs. Optionally specify environment')
  .action(wip);

program
  .command('server')
  .description('Start a local development server for APIs')
  .action(wip);

program.parse(process.argv);

function wip(){
  console.error("That command does not work yet")
}
