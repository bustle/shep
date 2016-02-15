'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (flags) {
  var funcs = _glob2.default.sync('functions/*').map(function (path) {
    return path.split('/').pop();
  });

  return (0, _prompt2.default)([{
    name: 'name',
    type: 'list',
    choices: funcs,
    message: 'Which lambda function?'
  }]).then(_index2.default);
};

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register');