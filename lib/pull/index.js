'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var apiId = _ref.apiId;
  var region = _ref.region;

  if (region) {
    _awsSdk2.default.config.update({ region: region });
  }

  return require('../util/api-gateway').getResources(apiId).get('items').then(function (api) {
    return _fsExtraPromise2.default.writeJsonAsync('api.json', api, { spaces: 2 });
  });
};

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fsExtraPromise = require('fs-extra-promise');

var _fsExtraPromise2 = _interopRequireDefault(_fsExtraPromise);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }