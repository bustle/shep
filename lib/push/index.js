'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (input, flags, config) {
  return createApi();

  function createApi() {
    if (config.apiId) {
      return _bluebird2.default.reject(new Error('API already exists'));
    } else {
      return new _bluebird2.default(function (resolve, reject) {
        var params = { name: config.apiName };
        apigateway.createRestApi(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            var configFile = (0, _fsExtra.readJsonSync)('config.json');
            configFile.apiId = data.id;
            (0, _fsExtra.writeJsonSync)('config.json', configFile, { spaces: 2 });
            resolve(data);
          }
        });
      });
    }
  }
};

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fsExtra = require('fs-extra');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apigateway = new _awsSdk2.default.APIGateway();