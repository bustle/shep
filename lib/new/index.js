const create = require('../util/create');
const P = require('bluebird');
const exec = require('../util/exec');
const log = require('../util/log');
const _ = require('lodash');

module.exports = function (args){
  var apiName = args._[1];
  var folderName = _.kebabCase(apiName);

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
    return P.all([
      create.file(folderName + '/config.json', { name: apiName }),
      create.file(folderName + '/.gitignore', 'environment.json'),
      create.file(folderName + '/environment.json', {})
    ]);
  }

  function initialGitCommit(){
    log.success('created initial git commit');
    return exec('git init && git add . && git commit -am "Initial commit"', { cwd: folderName });
  }
};
