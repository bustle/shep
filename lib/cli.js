#! /usr/bin/env node
const args = require('minimist')(process.argv.slice(2));

switch(args._[0]){
  case 'new':
    require('./new-project')(args._[1]);
    break;
  case 'generate':
    require('./generate')(args);
    break;
  case 'deploy':
    require('./deploy')(args);
    break;
  case 'configure':
    require('./configure')(args);
    break;
  case 'configure':
    console.log('Some day this will print out help. Today is not that day.');
    break;
  default:
    console.log('That command was not recognized');
}
