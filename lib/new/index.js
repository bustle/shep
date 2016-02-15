'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {

  return createProjectFolder().then(createApi).then(createFiles);

  function createProjectFolder() {
    return _fsExtraPromise2.default.mkdirAsync(opts.folder);
  }

  function createApi() {
    if (opts.api !== false) {
      _awsSdk2.default.config.update({ region: opts.region });
      return require('../util/api-gateway').createRestApi({ name: opts.apiName }).then(function (_ref) {
        var id = _ref.id;
        opts.apiId = id;
      });
    }
  }

  function createFiles() {
    return _bluebird2.default.all([_fsExtraPromise2.default.mkdirAsync(opts.folder + '/functions'), _fsExtraPromise2.default.writeFileAsync(opts.folder + '/package.json', require('./templates/package').default(opts)), _fsExtraPromise2.default.writeFileAsync(opts.folder + '/env.js.example', require('./templates/env').default(opts)), _fsExtraPromise2.default.writeFileAsync(opts.folder + '/.gitignore', require('./templates/gitignore').default(opts)), _fsExtraPromise2.default.writeFileAsync(opts.folder + '/README.md', require('./templates/readme').default(opts))]);
  }
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fsExtraPromise = require('fs-extra-promise');

var _fsExtraPromise2 = _interopRequireDefault(_fsExtraPromise);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }