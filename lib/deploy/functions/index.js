const P = require('bluebird');
const jsonFile = require('../../util/json-file');
const exec = require('../../util/exec');
const streamToBuffer = P.promisify(require('stream-to-buffer'));
const archiver = require('archiver');
const AWS = require('aws-sdk');
const _ = require('lodash');

module.exports = function(args){
  var dir = args._[2];
  return installDependencies().
    then(zip).
    then(uploadToAWS);

  function installDependencies(){
    return exec('npm install', { cwd: 'functions/' + dir });
  }

  function zip(){
    var archive = archiver.create('zip');
    archive.directory('functions/' + dir, false);
    archive.finalize();

    return streamToBuffer(archive);
  }


  function uploadToAWS(zipFile){
    return jsonFile.read('functions/' + dir + '/awsConfig.json').then(function(funcConfig){
      var lambda = new AWS.Lambda();
      var createFunction = P.promisify(lambda.createFunction);
      var params = {
        Code: {
          ZipFile: zipFile
        }
      };
      _.assign(params, funcConfig);
      return createFunction(params);
    });
  }
};
