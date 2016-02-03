'use strict';

var _bluebird = require('bluebird');

var _lodash = require('lodash');

var _fsExtra = require('fs-extra');

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var validCommands = ['create', 'push', 'deploy', 'run', 'pull'];

function shepherd(_ref) {
  var _ref$input = _toArray(_ref.input);

  var cmd = _ref$input[0];

  var input = _ref$input.slice(1);

  var flags = _ref.flags;

  if ((0, _lodash.contains)(validCommands, cmd)) {
    var config = {};
    if (input[0] !== 'project') {
      config = (0, _lodash.assign)(config, (0, _fsExtra.readJsonSync)('api.json'));
      _awsSdk2.default.config.update({ region: config.region });
    }
    return require('./' + cmd).default(config, input, flags);
  } else {
    return (0, _bluebird.reject)(new Error('That command was not recognized'));
  }
}

module.exports = shepherd;