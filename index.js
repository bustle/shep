const checkCwd = require('./lib/check-cwd');
const shepherd = require('./shepherd');

module.exports = function(args){
  const firstArg = args._[0];
  if (firstArg === 'new'){
    const folderName = args._[1];
    return shepherd.new(folderName);
  } else {
    checkCwd();
    switch(firstArg){
      case 'generate':
        return shepherd.generate(args);
      case 'deploy':
        return shepherd.deploy(args);
      case 'configure':
        return shepherd.configure(args);
      case 'pull':
        return shepherd.pull(args);
      case 'help':
        console.log('Some day this will print out help. Today is not that day.');
        break;
      default:
        console.log('That command was not recognized');
    }
  }
};
