const chalk = require('chalk');
const P = require('bluebird');
const mkdir = P.promisify(require('fs').mkdir);
const writeFile = P.promisify(require('fs').writeFile);

module.exports.dir = function (path){
  console.log(chalk.green('✔'),'created directory:', path);
  return mkdir(path);
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
  console.log(chalk.green('✔'),'created file:', path);
  return writeFile(path, stringContent);
};
