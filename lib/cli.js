#! /usr/bin/env node
'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _pkgConf = require('pkg-conf');

var _pkgConf2 = _interopRequireDefault(_pkgConf);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _fsExtraPromise = require('fs-extra-promise');

var _fsExtraPromise2 = _interopRequireDefault(_fsExtraPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)('\n    Usage\n      $ shepherd new\n      $ shepherd new --no-api\n      $ shepherd create-function\n      $ shepherd deploy\n\n    Options\n      -r, --rainbow  Include a rainbow\n');

var config = undefined;
try {
  config = _pkgConf2.default.sync('shepherd');
  _awsSdk2.default.config.update({ region: config.region });
} catch (e) {
  config = {};
}

try {
  config.resources = _fsExtraPromise2.default.readJSONSync('api.json');
} catch (e) {}

run(cli);

function run(_ref) {
  var input = _ref.input;
  var flags = _ref.flags;

  require('./' + input.join('/') + '/prompt').default(flags, config);
}