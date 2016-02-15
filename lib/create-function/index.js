'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts, config) {
  createDir().then(createFiles).then(createOnAWS);

  function createDir() {
    return _fsExtraPromise2.default.mkdirAsync('functions/' + opts.name);
  }

  function createFiles() {
    return _bluebird2.default.all([_fsExtraPromise2.default.writeFileAsync('functions/' + opts.name + '/index.js', require('./templates/index').default(opts)), _fsExtraPromise2.default.writeFileAsync('functions/' + opts.name + '/package.json', require('./templates/package').default(opts)), _fsExtraPromise2.default.writeFileAsync('functions/' + opts.name + '/.gitignore', require('./templates/gitignore').default(opts)), _fsExtraPromise2.default.writeFileAsync('functions/' + opts.name + '/lambda.json', require('./templates/lambda').default(opts)), _fsExtraPromise2.default.writeFileAsync('functions/' + opts.name + '/event.json', require('./templates/event').default(opts)), _fsExtraPromise2.default.writeFileAsync('functions/' + opts.name + '/env.js', require('./templates/env').default(opts))]);
  }

  function createOnAWS() {
    return (0, _deployFunction2.default)({ name: opts.name, namespace: config.functionNamespace });
  }
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fsExtraPromise = require('fs-extra-promise');

var _fsExtraPromise2 = _interopRequireDefault(_fsExtraPromise);

var _deployFunction = require('../deploy-function');

var _deployFunction2 = _interopRequireDefault(_deployFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }