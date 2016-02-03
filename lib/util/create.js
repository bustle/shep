'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var log = require('./log');
var P = require('bluebird');
var mkdir = P.promisify(require('fs').mkdir);
var writeFile = P.promisify(require('fs').writeFile);
var _ = require('lodash');

module.exports.dir = function (path) {
  return mkdir(path).tap(function () {
    log.success('created directory:', path);
  });
};

module.exports.file = function (path, content) {
  var stringContent;
  if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object') {
    stringContent = JSON.stringify(content, null, 2);
    if (_.endsWith(path, '.js')) {
      stringContent = 'module.exports = ' + stringContent + ';';
    }
  } else {
    stringContent = content;
  }
  return writeFile(path, stringContent).tap(function () {
    log.success('created file:', path);
  });
};