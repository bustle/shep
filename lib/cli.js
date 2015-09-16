#! /usr/bin/env node
const args = require('minimist')(process.argv.slice(2));
const checkCwd = require('./check-cwd');

switch(args._[0]){
  case 'new':
    require('./new-project')(args._[1]);
    break;
  case 'generate':
    checkCwd();
    require('./generate')(args);
    break;
  case 'deploy':
    checkCwd();
    require('./deploy')(args);
    break;
  case 'configure':
    checkCwd();
    require('./configure')(args);
    break;
  case 'configure':
    console.log('Some day this will print out help. Today is not that day.');
    break;
  default:
    console.log('That command was not recognized');
}
