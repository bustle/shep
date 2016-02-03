'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRestApi = createRestApi;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiGateway = new _awsSdk2.default.APIGateway();

function createRestApi(params) {
  return new _bluebird2.default(function (resolve, reject) {
    apiGateway.createRestApi(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}