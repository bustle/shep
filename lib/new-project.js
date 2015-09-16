const create = require('./create');
const P = require('bluebird');
const exec = P.promisify(require('child_process').exec);
const chalk = require('chalk');

module.exports = function (folderName){
  return create.dir(folderName).
    then(chdir).
    then(createDirectories).
    then(createFiles).
    then(initialGitCommit);

  function chdir(){
    process.chdir(folderName);
  }

  function createDirectories(){
    return P.all([
      create.dir('resources'),
      create.dir('stages'),
      create.dir('models'),
      create.dir('functions'),
    ]);
  }

  function createFiles(){
    var env = { name: folderName };
    return P.all([
      create.file({
        path: 'config.js',
        content: 'module.exports = ' + JSON.stringify(env, null, 2) + ';'
      }),
      create.file({
        path: '.gitignore',
        content: 'environment.js'
      }),
      create.file({
        path: 'environment.js',
        content: 'module.exports = {};'
      })
    ]);
  }

  function initialGitCommit(){
    console.log(chalk.green('✔'),'created initial git commit');
    return exec('git init && git add . && git commit -am "Initial commit"');
  }
};
