#! /usr/bin/env node

const fs = require('fs');
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
  fs.mkdir(folderName, function(err){
    if (err) { throw(err); }
    fs.mkdir(folderName + '/apis');
    fs.mkdir(folderName + '/functions');
    fs.createReadStream(__dirname + '/../templates/shepherd-config.js.template').pipe(fs.createWriteStream(folderName + '/shepherd-config.js'));
  });
}

function createAPI(name){
  fs.mkdir('./apis/' + name, function(err){
    if (err) { throw(err); }
    fs.mkdir('./apis/' + name + '/models');
    var apiConfig = { name: name, description: '' };
    fs.writeFile('./apis/' + name + '/config.js', 'module.exports = ' + JSON.stringify(apiConfig, null, 2));
  });
}

function createFunction(name){
  fs.mkdir('./functions/' + name, function(err){
    if (err) { throw(err); }
    fs.createReadStream(__dirname + '/../templates/functions/index.js.template').pipe(fs.createWriteStream('./functions/' + name + '/index.js'));
    var packageJSON = {
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
    fs.writeFile('./functions/' + name + '/package.json', JSON.stringify(packageJSON, null, 2));
  });
}
