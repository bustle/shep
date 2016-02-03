const log = require('./log');
const P = require('bluebird');
const mkdir = P.promisify(require('fs').mkdir);
const writeFile = P.promisify(require('fs').writeFile);
const _ = require('lodash');

module.exports.dir = function (path){
  return mkdir(path).tap(function(){
    log.success('created directory:', path);
  });
};

module.exports.file = function (path, content){
  var stringContent;
  if (typeof(content) === 'object'){
    stringContent = JSON.stringify(content, null, 2);
    if(_.endsWith(path, '.js')){
      stringContent = 'module.exports = ' + stringContent + ';';
    }
  } else {
    stringContent = content;
  }
  return writeFile(path, stringContent).tap(function(){
    log.success('created file:', path);
  });
};
