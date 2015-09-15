#! /usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const checkCwd = require('./check-cwd');

const userArgs = process.argv.slice(2);

switch(userArgs[0]){
  case 'new':
    createNewProject(userArgs[1]);
    break;
  case 'generate':
    generate(userArgs);
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

function createNewProject(folderName){
  createDir(folderName, function(err){
    if (err) { throw(err); }
    createDir(folderName + '/apis');
    createDir(folderName + '/functions');
    fs.createReadStream(__dirname + '/../templates/shepherd-config.js.template').pipe(fs.createWriteStream(folderName + '/shepherd-config.js'));
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
      contents: index
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
      contents: JSON.stringify(packageJSON, null, 2)
    });
  });
}

function createDir(path, cb){
  console.log(chalk.green('✔'),'created directory:', path);
  fs.mkdir(path, cb);
}

function createFile(opts){
  console.log(chalk.green('✔'),'created file:', opts.path);
  fs.writeFile(opts.path, opts.contents);
}
