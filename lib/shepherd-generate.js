#! /usr/bin/env node

var program = require('commander');
var fs = require('fs');
var chalk = require('chalk');

program
  .command('api <name>')
  .description('Generate an API')
  .action(createAPI);

program
  .command('function <name>')
  .description('Generate a lambda function')
  .action(createFunction);

program
  .command('test <name>')
  .description('Generate a test')
  .action(wip);

program.parse(process.argv);

function wip(){
  console.log(chalk.error("That command does not work yet"))
}

function createAPI(name){
  console.log('created api', name)
  fs.mkdir('./apis/' + name, function(err){
    if (err) { throw(err) }
  })
}

function createFunction(name){
  console.log('created function', name)
  fs.mkdir('./functions/' + name, function(err){
    if (err) { throw(err) }
    fs.createReadStream(__dirname + '/../templates/functions/index.js.template').pipe(fs.createWriteStream('./functions/' + name + '/index.js'));
    fs.createReadStream(__dirname + '/../templates/functions/package.json.template').pipe(fs.createWriteStream('./functions/' + name + '/package.json'));
  })
}
