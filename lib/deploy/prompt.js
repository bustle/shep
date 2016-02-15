'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (flags, config) {

  var envs = require(_path2.default.join(process.cwd(), 'env.js'));

  return (0, _prompt2.default)([{
    name: 'env',
    type: 'list',
    choices: Object.keys(envs),
    message: 'Which environment?'
  }]).then(function (answers) {
    return (0, _lodash.assign)({}, flags, answers);
  }).then(function (opts) {
    return (0, _index2.default)({ namespace: config.functionNamespace, env: envs[opts.env], envName: opts.env }, config);
  });
};

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _lodash = require('lodash');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }