const shepherd = {};

shepherd.new = function(folderName){
  require('./lib/new-project')(folderName);
};
shepherd.configure = function(args){
  require('./lib/configure')(args);
};
shepherd.deploy = function(args){
  require('./lib/deploy')(args);
};
shepherd.generate = function(args){
  require('./lib/generate')(args);
};

module.exports = shepherd;
