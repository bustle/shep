#! /usr/bin/env node

const P = require('bluebird');
const fs = require('fs');
const chalk = require('chalk');
const checkCwd = require('./check-cwd');
const glob = P.promisify(require('glob'));
const path = require('path');
const restapis = require('./api-gateway/restapis');

const userArgs = process.argv.slice(2);

switch(userArgs[0]){
  case 'new':
    createNewProject(userArgs[1]);
    break;
  case 'generate':
    generate(userArgs);
    break;
  case 'deploy':
    deploy(userArgs);
    break;
  default:
    console.log('default command');
}

function generate(args){
  checkCwd();
  switch (args[1]) {
    case 'api':
      createAPI(args[2]);
      break;
    case 'function':
      createFunction(args[2]);
      break;
    default:
      console.log('default command');
  }
}

function deploy(){
  checkCwd();
  findAPIs();
}

function findAPIs(){
  glob('./apis/*/config.js')
    .map(loadConfig)
    .filter(isNew)
    .map(deployAPI);
}

function deployAPI(config){
  restapis.create(config.name, config.description, console.log);
}

function isNew(config){
  return !config.id;
}

function loadConfig(file){
  return require(path.resolve(file));
}

function createNewProject(folderName){
  createDir(folderName, function(err){
    if (err) { throw(err); }
    createDir(folderName + '/apis');
    createDir(folderName + '/functions');
    createFile({
      path: folderName + '/shepherd-config.js',
      content: 'module.exports = {}'
    });
  });
}

function createAPI(name){
  createDir('./apis/' + name, function(err){
    if (err) { throw(err); }
    createDir('./apis/' + name + '/models');
    var apiConfig = { name: name, description: '' };
    createFile({
      path: './apis/' + name + '/config.js',
      content: 'module.exports = ' + JSON.stringify(apiConfig, null, 2)
    });
  });
}

function createFunction(name){
  createDir('./functions/' + name, function(err){
    if (err) { throw(err); }
    const index = `module.exports.handler = function(event, context) {
      // DO STUFF HERE
    }`;
    createFile({
      path: './functions/' + name + '/index.js',
      content: index
    });
    const packageJSON = {
      'name': name,
      'version': '0.0.1',
      'description': '',
      'main': 'index.js',
      'scripts': {
        'test': 'echo \"Error: no test specified\" && exit 1'
      },
      'author': '',
      'dependencies': {}
    };
    createFile({
      path: './functions/' + name + '/package.json',
      content: JSON.stringify(packageJSON, null, 2)
    });
  });
}

function createDir(path, cb){
  console.log(chalk.green('✔'),'created directory:', path);
  fs.mkdir(path, cb);
}

function createFile(opts){
  console.log(chalk.green('✔'),'created file:', opts.path);
  fs.writeFile(opts.path, opts.content);
}
