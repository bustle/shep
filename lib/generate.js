const checkCwd = require('./check-cwd');
const create = require('./create');

module.exports = function (args){
  checkCwd();
  switch (args[1]) {
    case 'resource':
      createResource(args[2]);
      break;
    case 'function':
      createFunction(args[2]);
      break;
    case 'model':
      createModel(args[2]);
      break;
    case 'stage':
      createStage(args[2]);
      break;
    default:
      console.log('default command');
  }
};

function createResource(name){
  return create.dir('./resources/' + name);
}

function createModel(){}

function createStage(){}

function createFunction(name){
  return create.dir('./functions/' + name).
    then(createIndexJS).
    then(createPackageJSON);

  function createIndexJS(){
    const index = `module.exports.handler = function(event, context) {
      // DO STUFF HERE
    }`;
    create.file({
      path: './functions/' + name + '/index.js',
      content: index
    });
  }

  function createPackageJSON(){
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
    create.file({
      path: './functions/' + name + '/package.json',
      content: JSON.stringify(packageJSON, null, 2)
    });
  }
}
