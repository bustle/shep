const create = require('./create');
const P = require('bluebird');
const exec = require('./util/exec');
const log = require('./log');

module.exports = function (folderName){
  return create.dir(folderName).
    then(createDirectories).
    then(createFiles).
    then(initialGitCommit);

  function createDirectories(){
    return P.all([
      create.dir(folderName + '/resources'),
      create.dir(folderName + '/stages'),
      create.dir(folderName + '/models'),
      create.dir(folderName + '/functions'),
    ]);
  }

  function createFiles(){
    var env = { name: folderName };
    return P.all([
      create.file(folderName + '/config.json', env),
      create.file(folderName + '/.gitignore', 'environment.json'),
      create.file(folderName + '/environment.json', {})
    ]);
  }

  function initialGitCommit(){
    log.success('created initial git commit');
    return exec('git init && git add . && git commit -am "Initial commit"', { cwd: folderName });
  }
};
