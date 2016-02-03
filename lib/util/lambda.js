'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFunc = getFunc;
exports.createFunc = createFunc;
exports.updateFuncCode = updateFuncCode;
exports.updateFuncConfig = updateFuncConfig;
exports.createAlias = createAlias;
exports.getAlias = getAlias;
exports.updateAlias = updateAlias;
exports.publishVersion = publishVersion;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lambda = new _awsSdk2.default.Lambda();

function getFunc(params) {
  return new _bluebird2.default(function (resolve, reject) {
    lambda.getFunction(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function createFunc(params) {
  return new _bluebird2.default(function (resolve, reject) {
    lambda.createFunction(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function updateFuncCode(params) {
  return new _bluebird2.default(function (resolve, reject) {
    lambda.updateFunctionCode(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function updateFuncConfig(params) {
  return new _bluebird2.default(function (resolve, reject) {
    lambda.updateFunctionConfiguration(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function createAlias(params) {
  return new _bluebird2.default(function (resolve, reject) {
    lambda.createAlias(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function getAlias(params) {
  return new _bluebird2.default(function (resolve, reject) {
    lambda.getAlias(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function updateAlias(params) {
  return new _bluebird2.default(function (resolve, reject) {
    lambda.updateAlias(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function publishVersion(params) {
  return new _bluebird2.default(function (resolve, reject) {
    lambda.publishVersion(params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}