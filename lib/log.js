const chalk = require('chalk');

module.exports.success = function(){
  var args = Array.prototype.slice.call(arguments);
  args.unshift(chalk.green('✔'));
  console.log.apply(console, args);
};

module.exports.failure = function(){
  var args = Array.prototype.slice.call(arguments);
  args.unshift(chalk.red('x'));
  console.log.apply(console, args);
};
