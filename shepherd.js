const shepherd = {};
const jsonFile = require('./lib/json-file');

shepherd.new = function(folderName){
  return require('./lib/new-project')(folderName);
};
shepherd.configure = function(args){
  return require('./lib/configure')(args);
};
shepherd.deploy = function(args){
  return require('./lib/deploy')(args);
};
shepherd.generate = function(args){
  return require('./lib/generate')(args);
};
shepherd.pull = function(){
  return jsonFile.read('config.json').then(function(config){
    return require('./lib/pull')(config.id);
  });
};

module.exports = shepherd;
