#! /usr/bin/env node
const userArgs = process.argv.slice(2);

switch(userArgs[0]){
  case 'new':
    require('./new-project')(userArgs[1]);
    break;
  case 'generate':
    require('./generate')(userArgs);
    break;
  case 'deploy':
    require('./deploy')(userArgs);
    break;
  default:
    console.log('default command');
}
