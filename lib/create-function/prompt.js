'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (flags, config) {
  return (0, _prompt2.default)([{
    name: 'name',
    message: 'Function name?',
    validate: function validate(input) {
      return (/^[a-zA-Z0-9-_]+$/.test(input) ? true : 'Function name must contain only letters, numbers, hyphens, or underscores'
      );
    }
  }, {
    name: 'role',
    message: 'Lambda execution role. This must already exist. See your IAM console for details'
  }]).then(function (answers) {
    return (0, _lodash.assign)({}, flags, answers);
  }).then(function (opts) {
    return (0, _index2.default)(opts, config);
  });
};

var _prompt = require('../util/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }