const chalk = require('chalk');
const P = require('bluebird');
const mkdir = P.promisify(require('fs').mkdir);
const writeFile = P.promisify(require('fs').writeFile);

module.exports.dir = function (path){
  return mkdir(path).tap(function(){
    console.log(chalk.green('✔'),'created directory:', path);
  });
};

module.exports.file = function (path, content){
  var stringContent;
  if (typeof(content) === 'object'){
    stringContent = JSON.stringify(content, null, 2);
    if(path.match(/.js/)){
      stringContent = 'module.exports = ' + stringContent + ';';
    }
  } else {
    stringContent = content;
  }
  return writeFile(path, stringContent).tap(function(){
    console.log(chalk.green('✔'),'created file:', path);
  });
};
