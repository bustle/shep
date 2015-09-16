const chalk = require('chalk');
const fs = require('fs');

module.exports.dir = function (path, cb){
  console.log(chalk.green('✔'),'created directory:', path);
  fs.mkdir(path, cb);
};

module.exports.file = function (opts){
  console.log(chalk.green('✔'),'created file:', opts.path);
  fs.writeFile(opts.path, opts.content);
};
