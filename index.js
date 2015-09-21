const checkCwd = require('./lib/check-cwd');
const shepherd = require('./shepherd');

module.exports = function(args){
  const firstArg = args._[0];
  if (firstArg === 'new'){
    const folderName = args._[1];
    shepherd.new(folderName);
  } else {
    checkCwd();
    switch(firstArg){
      case 'generate':
        shepherd.generate(args);
        break;
      case 'deploy':
        shepherd.deploy(args);
        break;
      case 'configure':
        shepherd.configure(args);
        break;
      case 'help':
        console.log('Some day this will print out help. Today is not that day.');
        break;
      default:
        console.log('That command was not recognized');
    }
  }
};
