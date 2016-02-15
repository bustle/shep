'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (flags, config) {
  return (0, _prompt2.default)([{
    name: 'path',
    message: 'Resource path?',
    default: '/users'
  }]).then(function (answers) {
    return (0, _index2.default)((0, _lodash.assign)({}, answers, flags), config);
  });
};

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }