const chalk = require('chalk');
const P = require('bluebird');
const mkdir = P.promisify(require('fs').mkdir);
const writeFile = P.promisify(require('fs').writeFile);

module.exports.dir = function (path){
  console.log(chalk.green('✔'),'created directory:', path);
  return mkdir(path);
};

module.exports.file = function (opts){
  console.log(chalk.green('✔'),'created file:', opts.path);
  return writeFile(opts.path, opts.content);
};
