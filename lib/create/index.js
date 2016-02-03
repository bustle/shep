'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config, _ref) {
  var _ref2 = _toArray(_ref);

  var cmd = _ref2[0];

  var input = _ref2.slice(1);

  if ((0, _lodash2.default)(validCommands, cmd)) {
    return require('./' + cmd).default(config, input);
  } else {
    return (0, _bluebird2.default)(new Error('That command was not recognized'));
  }
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var validCommands = ['project', 'resource'];